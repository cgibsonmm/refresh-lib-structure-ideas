export interface useBraintreeGatewayServiceProps {
  beforeClientCreationHandler?: (shouldCreate: boolean) => void;
  shouldCreatePaymentMethod?: () => boolean;
  setPaymentMethodSupport?: () => boolean | Promise<boolean>;
  clientCreationErrorHandler: (error: Error) => void;
  paymentInstanceCreatedHandler: (paymentMethodSupported?: boolean) => void;
  submitter: Element | null;
  submitHandler: ({ event }: { event: Event }) => void;
  setUpCustomButton?: () => void;
}

declare global {
  interface Window {
    braintree: {
      client: {
        create(options: { authorization: string }): Promise<unknown>;
      };
      paypal: {
        create(options: {
          client: unknown;
          [key: string]: unknown;
        }): Promise<unknown>;
      };
      googlePayment: {
        create(options: {
          client: unknown;
          [key: string]: unknown;
        }): Promise<unknown>;
      };
      applePay: {
        create(options: {
          client: unknown;
          [key: string]: unknown;
        }): Promise<unknown>;
      };
      venmo: {
        create(options: {
          client: unknown;
          [key: string]: unknown;
        }): Promise<unknown>;
      };
    };
    ApplePaySession: {
      supportsVersion: (version: number) => boolean;
      canMakePayments: () => boolean;
      canMakePaymentsWithActiveCard: (
        merchantIdentifier: string
      ) => Promise<boolean>;
      STATUS_FAILURE: unknown;
      STATUS_SUCCESS: unknown;
      new (version: number, paymentRequest: unknown): {
        begin: () => void;
        onvalidatemerchant: (event: Event) => void;
        onpaymentauthorized: (event: Event) => void;
      };
    };
    google: {
      payments: {
        api: {
          PaymentsClient: {
            new (options: { environment: string }): unknown;
          };
        };
      };
    };
  }
}
