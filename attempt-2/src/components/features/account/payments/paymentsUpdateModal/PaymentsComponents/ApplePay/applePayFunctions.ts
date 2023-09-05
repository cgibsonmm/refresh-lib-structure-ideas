export const submitPayment = ({
  paymentRequestOptions,
  merchantValidationOptions,
  paymentInstance,
  logError,
  addApplePayAgreement,
}: {
  paymentRequestOptions: {
    total: { label: string; amount: string };
    requiredBillingContactFields: [string];
  };
  merchantValidationOptions: { displayName: string };
  paymentInstance: {
    createPaymentRequest: (paymentRequestOptions: {
      total: {
        label: string;
        amount: string;
      };
    }) => unknown;
  };
  logError: (message: string, error: Error) => void;
  addApplePayAgreement: ({
    nonce,
    postalCode,
  }: {
    nonce: string;
    postalCode: string;
  }) => void;
}) => {
  const paymentRequest = paymentInstance.createPaymentRequest(
    paymentRequestOptions
  );

  const paymentSession = new window.ApplePaySession(3, paymentRequest);

  paymentSession.begin();

  paymentSession.onvalidatemerchant = (event: Event) => {
    return onValidateMerchant(
      { event, merchantValidationOptions, paymentSession, paymentInstance },
      logError
    );
  };
  paymentSession.onpaymentauthorized = (event: Event) => {
    return onPaymentAuthorized(
      { event, paymentSession, paymentInstance },
      logError,
      addApplePayAgreement
    );
  };
};

const onValidateMerchant = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { event, merchantValidationOptions, paymentSession, paymentInstance }: any,
  logError: (message: string, error: Error) => void
) => {
  paymentInstance
    .performValidation({
      validationURL: event.validationURL,
      ...merchantValidationOptions,
    })
    .then((merchantSession: unknown) => {
      paymentSession.completeMerchantValidation(merchantSession);
    })
    .catch((error: Error) => {
      logError(
        'Apple Pay failed to load. Please try again or try a different payment option.',
        error
      );
      paymentSession.abort();
    });
};

const onPaymentAuthorized = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { event, paymentSession, paymentInstance }: any,
  logError: (message: string, error: Error) => void,

  addApplePayAgreement: ({
    nonce,
    postalCode,
  }: {
    nonce: string;
    postalCode: string;
  }) => void
) => {
  paymentInstance
    .tokenize({
      token: event.payment.token,
    })
    .then((payload: unknown) => {
      paymentSuccessHandler(
        { event, payload, session: paymentSession },
        logError,
        addApplePayAgreement
      );
    })
    .catch((error: Error) => {
      logError('Braintree: Error tokenizing Apple Pay', error);
      paymentSession.completePayment(window.ApplePaySession.STATUS_FAILURE);
    });
};

const paymentSuccessHandler = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { event, payload, session }: any,
  logError: (message: string, error: Error) => void,
  addApplePayAgreement: ({
    nonce,
    postalCode,
  }: {
    nonce: string;
    postalCode: string;
  }) => void
) => {
  const { givenName, familyName, postalCode } =
    event?.payment?.billingContact || {};

  if (!givenName || !familyName || !postalCode) {
    logError(
      'Braintree: Apple Pay - Missing name or zip code data from response',
      new Error('Missing name or zip')
    );
    return;
  }

  addApplePayAgreement({ postalCode, nonce: payload.nonce });
  session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
};
