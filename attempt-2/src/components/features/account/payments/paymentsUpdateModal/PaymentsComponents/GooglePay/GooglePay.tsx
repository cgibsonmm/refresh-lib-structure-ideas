import React, {
  useContext,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
} from 'react';
import { useCreateBraintreePaymentMethod } from '@/account/braintreeService';
import { useSnackbar } from '@/alerts/index';
import { AppConfig } from '@/context/AppConfig';
import { Stack } from '@/theme/components';
import { useBraintreeGatewayService } from '../../BraintreeServices/BraintreeGatewayService';

export const GooglePay = ({
  setGooglePayHide,
  onCloseModal,
}: {
  setGooglePayHide: Dispatch<SetStateAction<boolean>>;
  onCloseModal: () => void;
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentsClient = useRef<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentDataRequest = useRef<any>();

  const { logError } = useContext(AppConfig);
  const { enqueueSnackbar } = useSnackbar();

  const addGooglePayQuery = useCreateBraintreePaymentMethod();

  const addGooglePayAgreement = ({
    nonce,
    postalCode,
  }: {
    nonce: string;
    postalCode: string;
  }) => {
    addGooglePayQuery.mutate(
      { nonce, postalCode },
      {
        onSuccess: () => {
          enqueueSnackbar('Google Pay account added successfully', {
            variant: 'success',
            autoHideDuration: 6000,
          });
          onCloseModal();
        },
        onError: () => {
          enqueueSnackbar(
            'An error occurred while adding Google Pay account. Please contact support for assistance.',
            {
              variant: 'error',
              autoHideDuration: 6000,
            }
          );
          onCloseModal();
        },
      }
    );
  };

  const setPaymentMethodSupport = async () => {
    paymentsClient.current = new window.google.payments.api.PaymentsClient({
      environment: 'PRODUCTION',
    });

    const isReadyToPay = await paymentsClient.current.isReadyToPay({
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods:
        braintreeGatewayResponse.paymentInstance.current.createPaymentDataRequest()
          .allowedPaymentMethods,
      existingPaymentMethodRequired: true,
    });

    const isPaymentMethodSupported = isReadyToPay.result;

    return isPaymentMethodSupported;
  };

  const createPaymentDataRequest = () => {
    paymentDataRequest.current =
      braintreeGatewayResponse.paymentInstance.current.createPaymentDataRequest(
        {
          transactionInfo: {
            currencyCode: 'USD',
            totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
          },
        }
      );

    const cardPaymentMethod =
      paymentDataRequest.current.allowedPaymentMethods[0];
    cardPaymentMethod.parameters.billingAddressRequired = true;
    cardPaymentMethod.parameters.billingAddressParameters = {
      format: 'MIN',
    };
  };

  const clientCreationErrorHandler = (error: Error) => {
    logError('Error Creating Google Pay Braintree Client', error);
  };

  const paymentInstanceCreatedHandler = (paymentMethodSupported?: boolean) => {
    if (!paymentMethodSupported) return;
    setGooglePayHide(false);
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

    submitPayment();
  };

  const submitPayment = async () => {
    try {
      createPaymentDataRequest();

      const paymentData = await paymentsClient.current.loadPaymentData(
        paymentDataRequest.current
      );

      const payload =
        await braintreeGatewayResponse.paymentInstance.current.parseResponse(
          paymentData
        );

      const { postalCode } =
        paymentData?.paymentMethodData?.info?.billingAddress || {};

      if (!postalCode) {
        logError(
          'Braintree: Google Pay - Missing name or zip code data from response',
          new Error('Missing zip or name')
        );
        enqueueSnackbar('Missing ZIP Code', { variant: 'error' });
        return;
      }

      addGooglePayAgreement({ nonce: payload.nonce, postalCode });
    } catch (error) {
      logError(
        'Braintree: Google Pay Failure After Button Click',
        error as Error
      );
    }
  };

  const setUpCustomButton = () => {
    const button = paymentsClient.current.createButton({
      buttonType: 'long',
      onClick: (event: Event) => {
        submitHandler({ event });
      },
    });

    buttonRef.current?.appendChild(button);
  };

  const paymentProvider = 'googlePayment';

  const configObject = {
    clientCreationErrorHandler,
    paymentInstanceCreatedHandler,
    submitter: buttonRef.current,
    submitHandler,
    setPaymentMethodSupport,
    setUpCustomButton,
  };

  const paymentInstanceConfig = {
    googlePayVersion: 2,
    googleMerchantId: 'BCR2DN6T5O3KZYDB',
  };

  const braintreeGatewayResponse = useBraintreeGatewayService(
    paymentProvider,
    configObject,
    paymentInstanceConfig
  );

  useEffect(() => {
    if (!braintreeGatewayResponse.isReadyForGateway) return;
    braintreeGatewayResponse.initializePaymentGateway();
  }, [braintreeGatewayResponse.isReadyForGateway]);

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      gap={1}
      ref={buttonRef}
    />
  );
};
