import { useRef } from 'react';
import { useBraintreeClient } from './BraintreeClientService';
import { useBraintreeGatewayServiceProps } from './constants';

export const useBraintreeGatewayService = (
  paymentProvider: 'googlePayment' | 'applePay' | 'venmo',
  {
    beforeClientCreationHandler,
    shouldCreatePaymentMethod = () => true,
    setPaymentMethodSupport = () => true,
    clientCreationErrorHandler,
    paymentInstanceCreatedHandler,
    submitter,
    submitHandler,
    setUpCustomButton,
  }: useBraintreeGatewayServiceProps,
  paymentInstanceConfig?: Record<string, unknown>
) => {
  const braintreeClientResponse = useBraintreeClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentInstance = useRef<any>(false);

  const initializePaymentGateway = () => {
    const shouldCreatePaymentMethodResponse = shouldCreatePaymentMethod();

    //TODO: This is for calling a general error when ApplePay is not supported.
    beforeClientCreationHandler?.(shouldCreatePaymentMethodResponse);

    if (!shouldCreatePaymentMethodResponse) return;

    braintreeClientResponse.getClientInstance(async (error) => {
      if (error) {
        onClientCreationError(error as Error);
        return;
      }

      try {
        paymentInstance.current = await createPaymentInstance();
        onPaymentInstanceCreated();
      } catch (error) {
        onClientCreationError(error as Error);
      }
    });
  };

  const createPaymentInstance = async () => {
    return await window.braintree[paymentProvider].create({
      client: braintreeClientResponse.clientInstance.current,
      ...paymentInstanceConfig,
    });
  };

  const onPaymentInstanceCreated = async () => {
    const paymentMethodSupported = await setPaymentMethodSupport();
    paymentInstanceCreatedHandler?.(paymentMethodSupported);
    if (setUpCustomButton && paymentMethodSupported) {
      return setUpCustomButton();
    }
    paymentMethodSupported && setupPaymentButton();
  };

  const setupPaymentButton = () => {
    if (submitter && submitHandler) {
      submitter.addEventListener('click', (event: Event) => {
        submitHandler({ event });
      });
    }
  };

  const onClientCreationError = (error: Error) => {
    clientCreationErrorHandler?.(error);
  };

  return {
    initializePaymentGateway,
    isTokenExpired: braintreeClientResponse.isTokenExpired,
    paymentInstance: paymentInstance,
    isReadyForGateway: braintreeClientResponse.isReadyForGateway,
  };
};
