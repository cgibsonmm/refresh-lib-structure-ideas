import { useEffect, useState } from 'react';
import {
  filterActivePaymentMethod,
  useGetPaymentMethod,
} from '@/account/paymentMethodsService';
import {
  useProcessCard,
  useReactivateAccountTimeLeft,
  useProcessPayPal,
} from '@/account/payments/useSubscriptionUpgrade';
import { useSnackbar } from '@/alerts/index';
import { useSession } from '@/auth/Session';
import { ProcessingSpinnerModal } from '@/reports/index';
import { useSubmitLegal } from '@/reports/shared/PdfAddon/useTosService';
import { Button, Card } from '@/theme/index';
import { dollarize } from '@/utils/dollarize';
import { useRedirect } from '@/utils/hooks/useRedirect';
import { DateUtil } from '@/utils/index';
import { Bar, BarContent, BarTitle } from './Components';
import { PaymentMethods, SubscriptionPlan } from '../../Interfaces';
import { TosModal } from '../../TosModal/TosModal';
import { PaymentContainer } from '../PaymentContainer';
import { ReactivationLoading } from '../ReactivationLoading';
import { useProcessPayment } from '../useProcessPayment';
import { useReactivationPlans } from '../useReactivationPlans';

export function ReactivatePausedAccountCta() {
  const {
    session: { account },
  } = useSession();

  const { data: paymentQuery, isError: paymentQueryError } =
    useGetPaymentMethod();

  const { data: reactivationPlans, isError: reactivationPlansError } =
    useReactivationPlans();

  const { redirect } = useRedirect();

  const paymentMethodQuery = useGetPaymentMethod();

  const { enqueueSnackbar } = useSnackbar();

  const updateLegalQuery = useSubmitLegal();

  const { processPayment } = useProcessPayment();

  const reactivationProcessCardQuery = useProcessCard();

  const reactivationProcessPayPalQuery = useProcessPayPal();

  const reactivationProcessTimeLeft = useReactivateAccountTimeLeft();

  const [reportsRemaining, setReportsRemaining] = useState(0);
  const [expirationDate, setExpirationDate] = useState('');
  const [selectedPlan, setSelectedPlan] = useState({});
  const [firstRender, setFirstRender] = useState(true);
  const [openEditPayment, setOpenEditPayment] = useState(false);
  const [tosModalOpen, setTosModalOpen] = useState(false);
  const [activePayment, setActivePayment] = useState<PaymentMethods>();

  let showProcessingModal =
    updateLegalQuery.isLoading ||
    reactivationProcessCardQuery.isLoading ||
    reactivationProcessPayPalQuery.isLoading ||
    reactivationProcessTimeLeft.isLoading;

  useEffect(() => {
    setReportsRemaining(
      account?.account?.subscription_info?.monthly_reports_remaining || 0
    );

    setExpirationDate(
      account?.account?.subscription_info?.normalize_date || ''
    );

    if (
      account?.account.subscription_info?.subscription_plan_internal_name &&
      firstRender
    ) {
      handleSelectedPlan(
        account?.account.subscription_info?.subscription_plan_internal_name
      );
    }
  }, [account, reactivationPlans]);

  useEffect(() => {
    if (!paymentMethodQuery.isLoading && !paymentMethodQuery.isError) {
      setActivePayment(filterActivePaymentMethod(paymentMethodQuery?.data));
    }
  }, [paymentMethodQuery]);

  const handleSelectedPlan = (selectedPlanInternalName: string) => {
    if (reactivationPlans) {
      const selectedPlan = reactivationPlans.find(
        (plan: { internal_name: string }) =>
          plan.internal_name === selectedPlanInternalName
      );
      setSelectedPlan(selectedPlan || reactivationPlans[0]);
      setFirstRender(false);
    }
  };

  const dateUtil = new DateUtil();

  let paymentMethods: PaymentMethods[] = [];

  if (paymentQuery) {
    paymentMethods = paymentQuery.payment_methods;
  }

  const toggleEditPayment = () => {
    setOpenEditPayment((prevState) => !prevState);
  };

  const updateLegalHandler = () => {
    setTosModalOpen(false);
    updateLegalQuery.mutate(
      { legal_doc: 'tos' },
      {
        onSuccess() {
          showProcessingModal = processPayment(
            expirationDate,
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

  const handleActivateClick = () => {
    if (activePayment?.active && selectedPlan) {
      setTosModalOpen(true);
    } else if (!activePayment?.active && selectedPlan) {
      toggleEditPayment();
    }
  };

  if (paymentQueryError || reactivationPlansError) {
    redirect('/error');
  }

  if (!account || !reactivationPlans || !paymentQuery)
    return <ReactivationLoading />;

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Bar
        data-testid="reports-left"
        sx={(theme) => ({
          backgroundColor: theme.palette.grey[200],
        })}
      >
        <BarTitle>{reportsRemaining}</BarTitle>
        <BarContent data-testid="expiration-date">
          Reports left until{' '}
          {dateUtil.parseDateFromString(expirationDate, 'MMM d')}
        </BarContent>
      </Bar>
      <Bar
        data-testid="days-left"
        sx={(theme) => ({
          backgroundColor: theme.palette.secondary.light,
        })}
      >
        <BarTitle>{dateUtil.getDaysDiffFromNow(expirationDate)}</BarTitle>
        <BarContent>Days left of your membership</BarContent>
      </Bar>
      <div style={{ textAlign: 'center' }} data-testid="reactivate-message">
        <div style={{ marginBottom: '10px' }}>
          Your membership ends on{' '}
          <span style={{ fontWeight: 'bold' }}>
            {dateUtil.parseDateFromString(expirationDate, 'M/d')}
          </span>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold' }}>Activate today</span> to maintain
          access
        </div>
      </div>
      <PaymentContainer
        hideSwitchPlan={true}
        paymentMethod={paymentMethods}
        selectedPlan={selectedPlan as unknown as SubscriptionPlan}
        openEditPayment={openEditPayment}
        toggleEditPayment={toggleEditPayment}
      />
      <Button
        variant="contained"
        color="success"
        sx={{ marginTop: '20px' }}
        onClick={handleActivateClick}
        data-testid="reactivate-button"
      >
        Activate today
      </Button>
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
    </Card>
  );
}
