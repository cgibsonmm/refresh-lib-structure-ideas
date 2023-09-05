import {
  useProcessCard,
  useReactivateAccountTimeLeft,
  useProcessPayPal,
} from '@/account/payments/useSubscriptionUpgrade';
import { useSnackbar } from '@/alerts/index';
import { useRedirect } from '@/utils/hooks/useRedirect';
import { DateUtil } from '@/utils/index';
import { PaymentMethods, SubscriptionPlan } from '../Interfaces';

const dateUtil = new DateUtil();

export const useProcessPayment = () => {
  const reactivationProcessTimeLeft = useReactivateAccountTimeLeft();

  const { enqueueSnackbar } = useSnackbar();

  const { redirect } = useRedirect();

  const reactivationProcessCardQuery = useProcessCard();

  const reactivationProcessPayPalQuery = useProcessPayPal();

  function processPayment(
    expirationDate: string | undefined,
    activePayment: PaymentMethods | undefined,
    showProcessingModal: boolean,
    selectedPlan: SubscriptionPlan
  ) {
    const hasTimeLeft =
      (dateUtil.getDaysDiffFromNow(expirationDate ?? '') ?? 0) > 0;

    if (hasTimeLeft) {
      reactivationProcessTimeLeft.mutate('true', {
        onSuccess() {
          enqueueSnackbar('Account reactivated successfuly', {
            variant: 'success',
          });
          redirect('/dashboard');
        },
        onError() {
          enqueueSnackbar(
            'Something went wrong, please try again or contact customer service',
            { variant: 'error' }
          );
          showProcessingModal = false;
        },
      });
    }
    if (activePayment?.card_type === 'paypal') {
      reactivationProcessPayPalQuery.mutate(
        {
          paymentAgreementId: activePayment.id,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          plan: { unique_key: selectedPlan?.unique_key },
        },
        {
          onSuccess() {
            enqueueSnackbar('Account reactivated successfuly', {
              variant: 'success',
            });
            redirect('/dashboard');
          },
          onError() {
            enqueueSnackbar(
              'Something went wrong, please try again or contact customer service',
              { variant: 'error' }
            );
            showProcessingModal = false;
          },
        }
      );
    } else {
      reactivationProcessCardQuery.mutate(
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          creditCardId: activePayment?.id,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          plan: { unique_key: selectedPlan?.unique_key },
        },
        {
          onSuccess() {
            enqueueSnackbar('Account reactivated successfuly', {
              variant: 'success',
            });
            redirect('/dashboard');
          },
          onError() {
            enqueueSnackbar(
              'Something went wrong, please try again or contact customer service',
              { variant: 'error' }
            );
            showProcessingModal = false;
          },
        }
      );
    }

    return showProcessingModal;
  }

  return { processPayment };
};
