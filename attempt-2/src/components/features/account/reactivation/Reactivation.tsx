import { useEffect, useState } from 'react';
import {
  filterActivePaymentMethod,
  useGetPaymentMethod,
} from '@/account/paymentMethodsService';
import {
  useProcessCard,
  useProcessPayPal,
  useReactivateAccountTimeLeft,
} from '@/account/payments/useSubscriptionUpgrade';
import { useAccount } from '@/account/useAccount';
import { useSnackbar } from '@/alerts/index';
import { ProcessingSpinnerModal } from '@/reports/index';
import { useSubmitLegal } from '@/reports/shared/PdfAddon/useTosService';
import { Button, Text } from '@/theme/index';
import { calculateExpiredDays } from '@/utils/calculateExpiredDays';
import { dollarize } from '@/utils/dollarize';
import { useRedirect } from '@/utils/hooks/useRedirect';
import { EditPlan } from './EditPlan';
import { PaymentContainer } from './PaymentContainer';
import { ReactivationLoading } from './ReactivationLoading';
import { ButtonContainer, ReactivationContainer } from './components';
import { useProcessPayment } from './useProcessPayment';
import { useReactivationPlans } from './useReactivationPlans';
import { PaymentMethods, SubscriptionPlan } from '../Interfaces';
import { TosModal } from '../TosModal/TosModal';
import { PayPalRedirectionModal } from '../payments/paymentsUpdateModal/PaymentsComponents/PayPalRedirectionModal';

/**
 * This component allows the user to reactivate their account.
 * Internally, it loads the account data, the payment methods and the reactivation plans.
 * It also handles the TOS acceptance and the payment processing.
 */
export function Reactivation() {
  const { data: accountData, isError: accountDataError } = useAccount(true);
  const { data: paymentQuery, isError: paymentQueryError } =
    useGetPaymentMethod();
  const { data: reactivationPlans, isError: reactivationPlansError } =
    useReactivationPlans();
  const { redirect } = useRedirect();
  const updateLegalQuery = useSubmitLegal();
  const reactivationProcessCardQuery = useProcessCard();
  const reactivationProcessPayPalQuery = useProcessPayPal();
  const reactivationProcessTimeLeft = useReactivateAccountTimeLeft();

  const { processPayment } = useProcessPayment();

  const [editPlanOpen, setEditPlanOpen] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [defaultPlan, setDefaultPlan] = useState({});
  const [tosModalOpen, setTosModalOpen] = useState(false);
  const [openEditPayment, setOpenEditPayment] = useState(false);
  const [activePayment, setActivePayment] = useState<PaymentMethods>();
  const [openPaypalRedirection, setOpenPaypalRedirection] =
    useState<boolean>(false);
  const [paypalState, setPaypalState] = useState<'canceled' | 'success'>(
    'success'
  );

  const togglePaypalRedirectionModal = () =>
    setOpenPaypalRedirection(!openPaypalRedirection);

  const paymentMethodQuery = useGetPaymentMethod();
  const { enqueueSnackbar } = useSnackbar();
  const expireDate = calculateExpiredDays(
    accountData?.account.subscription_info?.normalize_date
  );

  let showProcessingModal =
    updateLegalQuery.isLoading ||
    reactivationProcessCardQuery.isLoading ||
    reactivationProcessPayPalQuery.isLoading ||
    reactivationProcessTimeLeft.isLoading;

  let paymentMethods: PaymentMethods[] = [];

  if (paymentQuery) {
    paymentMethods = paymentQuery.payment_methods;
  }

  useEffect(() => {
    if (
      accountData?.account.subscription_info?.subscription_plan_internal_name &&
      firstRender
    ) {
      handleSelectedPlan(
        accountData?.account.subscription_info?.subscription_plan_internal_name,
        accountData?.account.subscription_info?.monthly_report_limit
      );
      setFirstRender(false);
    }
  }, [accountData]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('bvppcanc')) {
      setPaypalState('canceled');
      setOpenPaypalRedirection(true);
      return;
    }
    if (urlParams.get('bvpp') && urlParams.get('token')) {
      setPaypalState('success');
      setOpenPaypalRedirection(true);
    }
  }, []);

  useEffect(() => {
    if (editPlanOpen) return;
    setDefaultPlan(selectedPlan);
  }, [selectedPlan, editPlanOpen]);

  useEffect(() => {
    if (!paymentMethodQuery.isLoading && !paymentMethodQuery.isError) {
      setActivePayment(filterActivePaymentMethod(paymentMethodQuery?.data));
    }
  }, [paymentMethodQuery]);

  const toggleEditPlan = () => {
    setEditPlanOpen((prevState) => !prevState);
  };

  const handleSelectedPlan = (
    selectedPLanInternalName: string,
    selectedPLanMonthlyReportLimit: number
  ) => {
    if (reactivationPlans) {
      const selectedPlan = reactivationPlans.find(
        (plan: { monthly_report_limit: number; internal_name: string }) =>
          plan.monthly_report_limit >= selectedPLanMonthlyReportLimit ||
          plan.internal_name === selectedPLanInternalName
      );
      setSelectedPlan(selectedPlan || reactivationPlans[0]);
    }
  };

  const handleCancelClick = () => {
    setSelectedPlan(defaultPlan);
    toggleEditPlan();
  };

  const daysAgoText = () => {
    const daysAgoText = expireDate === 1 ? 'day' : 'days';
    return `${expireDate} ${daysAgoText}`;
  };

  const toggleEditPayment = () => {
    setOpenEditPayment((prevState) => !prevState);
  };

  const handleActivateClick = () => {
    if (activePayment?.active && selectedPlan) {
      setTosModalOpen(true);
    } else if (!activePayment?.active && selectedPlan) {
      toggleEditPayment();
    } else {
      toggleEditPlan();
    }
  };

  const updateLegalHandler = () => {
    setTosModalOpen(false);
    updateLegalQuery.mutate(
      { legal_doc: 'tos' },
      {
        onSuccess() {
          showProcessingModal = processPayment(
            accountData?.account.subscription_info?.normalize_date,
            activePayment,
            showProcessingModal,
            selectedPlan as unknown as SubscriptionPlan
          );
        },
        onError() {
          enqueueSnackbar(
            'Something went wrong, please try again or contact customer service',
            { variant: 'error' }
          );
        },
      }
    );
  };

  if (accountDataError || paymentQueryError || reactivationPlansError) {
    redirect('/error');
  }

  if (!accountData || !reactivationPlans || !paymentQuery)
    return <ReactivationLoading />;

  if (editPlanOpen) {
    return (
      <EditPlan
        plans={reactivationPlans as SubscriptionPlan[]}
        selectedPlan={selectedPlan as unknown as SubscriptionPlan}
        toggleEditPlan={toggleEditPlan}
        handleSelectedPlan={handleSelectedPlan}
        handleCancelClick={handleCancelClick}
      />
    );
  }

  return (
    <ReactivationContainer>
      <Text variant="h2">Reactivate your account today!</Text>
      <Text variant="h3">Your account expired {daysAgoText()} ago</Text>
      <PaymentContainer
        paymentMethod={paymentMethods}
        selectedPlan={selectedPlan as unknown as SubscriptionPlan}
        toggleEditPlan={toggleEditPlan}
        openEditPayment={openEditPayment}
        toggleEditPayment={toggleEditPayment}
      />

      <ButtonContainer>
        <Button
          onClick={handleActivateClick}
          variant="contained"
          sx={{ paddingBlock: 0.75, paddingInline: 4.75 }}
        >
          Activate Today
        </Button>
      </ButtonContainer>
      {tosModalOpen && (
        <TosModal
          open={tosModalOpen}
          onClose={() => setTosModalOpen(false)}
          acceptTos={updateLegalHandler}
          showCheckbox
          billingFrecuency=""
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          billedPrice={dollarize(selectedPlan.amount)}
          showPaymentMethod={false}
          cta={{ text: 'Accept and Reactivate', extraWide: true }}
        />
      )}
      {showProcessingModal && (
        <ProcessingSpinnerModal
          open={showProcessingModal}
          onClose={() => setTosModalOpen(false)}
        />
      )}

      <PayPalRedirectionModal
        paypalState={paypalState}
        isOpen={openPaypalRedirection}
        onCloseHandle={togglePaypalRedirectionModal}
      />
    </ReactivationContainer>
  );
}
