import React, {
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';
import { useCreateBraintreePaymentMethod } from '@/account/braintreeService';
import { useSnackbar } from '@/alerts/index';
import { AppConfig } from '@/context/AppConfig';
import { AppConstants } from '@/context/AppConstants';
import { Button, Stack, Text } from '@/theme/components';
import { Icons } from '@/theme/index';
import { submitPayment } from './applePayFunctions';
import { useBraintreeGatewayService } from '../../BraintreeServices/BraintreeGatewayService';

export const ApplePay = ({
  setApplePayHide,
  onCloseModal,
}: {
  setApplePayHide: Dispatch<SetStateAction<boolean>>;
  onCloseModal: () => void;
}) => {
  const context = useContext(AppConstants);
  const { logError } = useContext(AppConfig);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const addApplePayQuery = useCreateBraintreePaymentMethod();

  const { enqueueSnackbar } = useSnackbar();

  const addApplePayAgreement = ({
    nonce,
    postalCode,
  }: {
    nonce: string;
    postalCode: string;
  }) => {
    addApplePayQuery.mutate(
      { nonce, postalCode },
      {
        onSuccess: () => {
          enqueueSnackbar('Apple Pay account added successfully', {
            variant: 'success',
            autoHideDuration: 6000,
          });
          onCloseModal();
        },
        onError: () => {
          enqueueSnackbar(
            'An error occurred while adding Apple Pay account. Please contact support for assistance.',
            {
              variant: 'success',
              autoHideDuration: 6000,
            }
          );
          onCloseModal();
        },
      }
    );
  };

  const submitHandler = ({ event }: { event: Event }) => {
    event.preventDefault();

    if (braintreeGatewayResponse.isTokenExpired.current) {
      enqueueSnackbar(
        'Your session has expired. For your security, please refresh the page to restart your session.',
        { variant: 'error' }
      );
      return;
    }

    const hostnameLabel = context.brandName;
    submitPayment({
      paymentRequestOptions: {
        total: {
          label: 'to Update Payment Method',
          amount: '0',
        },
        requiredBillingContactFields: ['postalAddress'],
      },
      merchantValidationOptions: {
        displayName: `${hostnameLabel} Update Payment Method`,
      },
      paymentInstance: braintreeGatewayResponse.paymentInstance.current,
      logError,
      addApplePayAgreement,
    });
  };

  const paymentProvider = 'applePay';

  const beforeClientCreationHandler = (willCreatePaymentMethod: boolean) => {
    if (!willCreatePaymentMethod) {
      logError(
        'Apple pay not supported',
        new Error(
          'Braintree: This device does not support Apple Pay or is not capable of making Apple Pay payments'
        )
      );
    }
  };

  const clientCreationErrorHandler = (error: Error) => {
    logError('Error Creating Apple Pay Braintree Client', error);
  };

  const paymentInstanceCreatedHandler = () => {
    setApplePayHide(false);
  };

  const shouldCreatePaymentMethod = () => {
    return (
      window.ApplePaySession &&
      window.ApplePaySession.supportsVersion(3) &&
      window.ApplePaySession.canMakePayments()
    );
  };

  const setPaymentMethodSupport = async () => {
    return await window.ApplePaySession.canMakePaymentsWithActiveCard(
      braintreeGatewayResponse.paymentInstance.current.merchantIdentifier
    );
  };

  const configObject = {
    beforeClientCreationHandler,
    clientCreationErrorHandler,
    paymentInstanceCreatedHandler,
    submitter: buttonRef.current,
    submitHandler,
    shouldCreatePaymentMethod,
    setPaymentMethodSupport,
  };

  const braintreeGatewayResponse = useBraintreeGatewayService(
    paymentProvider,
    configObject
  );

  useEffect(() => {
    if (!braintreeGatewayResponse.isReadyForGateway) return;
    braintreeGatewayResponse.initializePaymentGateway();
  }, [braintreeGatewayResponse.isReadyForGateway]);

  return (
    <Stack justifyContent="center" alignItems="center" gap={1}>
      <Button
        id="apple-pay-template"
        fullWidth
        sx={{
          backgroundColor: 'black',
          color: 'white',
          maxWidth: '200px',
          ':hover': {
            backgroundColor: 'black', // theme.palette.primary.main
            color: 'white',
          },
        }}
        ref={buttonRef}
      >
        <Icons.Apple />
        <Text variant="h3" margin={0} padding={0}>
          Pay
        </Text>
      </Button>
    </Stack>
  );
};
