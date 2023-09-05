import { useContext, useState } from 'react';
import { AppConstants } from '@/context/AppConstants';
import { Button, Text } from '@/theme/index';
import { capitalizeString, singularizeString } from '@/utils/index';
import {
  CardImage,
  CardRow,
  ComponentContainer,
  DescriptionRow,
  PlanRow,
} from './components';
import { PaymentImages, PaymentMethods, SubscriptionPlan } from '../Interfaces';
import { PaymentsSelectionModal } from '../PaymentsSelectionModal';
import { RadioPaymentsModal } from '../payments/paymentsUpdateModal/PaymentsComponents/RadioPaymentsModal';

interface PaymentContainerProps {
  /** The payment method selected by the user. */
  paymentMethod: PaymentMethods[];
  /** The plan selected by the user to reactivate. */
  selectedPlan: SubscriptionPlan;
  /** Callback fired when the user clicks on the **Switch Plan** button. */
  toggleEditPlan?: () => void;
  /** Callback fired when the user clicks on the **Edit Billing** button. */
  toggleEditPayment: () => void;
  openEditPayment: boolean;
  /** If true, the **Switch Plan** button is hidden. */
  hideSwitchPlan?: boolean;
}

/** This component displays the user's payment method and the plan they selected to reactivate their subscription. */
export function PaymentContainer({
  paymentMethod,
  toggleEditPlan,
  selectedPlan,
  toggleEditPayment,
  openEditPayment,
  hideSwitchPlan,
}: PaymentContainerProps) {
  const context = useContext(AppConstants);
  const [openPaymentsUpdateModal, setOpenPaymentsUpdateModal] = useState(false);

  const planName = selectedPlan?.title;
  const decimalizedPlanAmount = selectedPlan?.amount / 100;
  const planPrice =
    selectedPlan.renewal_period === 1
      ? `$${decimalizedPlanAmount} / ${capitalizeString(
          singularizeString(selectedPlan?.renewal_period_type)
        )} plus applicable sales tax`
      : `$${decimalizedPlanAmount} / ${capitalizeString(
          selectedPlan?.renewal_period_type || ''
        )} plus applicable sales tax`;
  let imgSrc;
  if (paymentMethod && paymentMethod[0]?.card_type && context) {
    imgSrc = context[paymentMethod[0]?.card_type as keyof PaymentImages];
  }

  const handlePaymentSelectionModalClose = () => {
    toggleEditPayment();
  };

  const togglePaymentsUpdateModal = () => {
    setOpenPaymentsUpdateModal(!openPaymentsUpdateModal);
    if (!openEditPayment) {
      toggleEditPayment();
    }
  };

  const sixDigitMask = () => {
    if (!paymentMethod[0]?.last_four) return 'XX-XXXX';
    return `XX-${paymentMethod[0]?.last_four}`;
  };

  if (!paymentMethod) return <div>Loading...</div>;

  return (
    <ComponentContainer>
      <CardRow>
        <div>
          <CardImage src={imgSrc} alt="Card Logo" />
          <Text
            variant="body1"
            lineHeight={1.2}
            sx={{ margin: 0 }}
            data-testid="card-number"
          >
            {sixDigitMask()}
          </Text>
        </div>
        <Button data-testid="edit-billing" onClick={toggleEditPayment}>
          <Text
            fontSize={'0.75rem'}
            fontWeight={700}
            lineHeight={1.2}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Edit Billing
          </Text>
        </Button>
      </CardRow>
      <div>
        <PlanRow>
          <Text variant="h5" lineHeight={1.2} sx={{ margin: 0 }}>
            {planName}
          </Text>
          {!hideSwitchPlan && (
            <Button data-testid="switch-plan" onClick={toggleEditPlan}>
              <Text
                fontSize={'0.75rem'}
                fontWeight={700}
                lineHeight={1.2}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Switch plan
              </Text>
            </Button>
          )}
        </PlanRow>
        <DescriptionRow data-testid="plan-price">
          <Text variant="body2" lineHeight={1.2} sx={{ color: '#757575' }}>
            {planPrice}
          </Text>
          <Text variant="body2" lineHeight={1.2} sx={{ color: '#757575' }}>
            This subscription will renew every month until you cancel.
          </Text>
        </DescriptionRow>
      </div>
      {openEditPayment && (
        <PaymentsSelectionModal
          open={openEditPayment}
          inReactivation
          onClose={handlePaymentSelectionModalClose}
          onAddPaymentMethod={() => {
            toggleEditPayment();
            setOpenPaymentsUpdateModal(true);
          }}
        />
      )}
      {openPaymentsUpdateModal && (
        <RadioPaymentsModal
          isOpen={openPaymentsUpdateModal}
          onCloseHandle={togglePaymentsUpdateModal}
        />
      )}
    </ComponentContainer>
  );
}
