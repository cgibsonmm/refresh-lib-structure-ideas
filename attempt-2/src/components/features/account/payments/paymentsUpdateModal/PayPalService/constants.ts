export interface PayPalEvent extends Event {
  preventDefault(): void;
}

interface setupConfigProps {
  click: (event: PayPalEvent) => void;
  container: string;
  size: string;
  shape: string;
}

declare global {
  interface Window {
    paypal: {
      checkout: {
        initXO: () => void;
        setup: (merchantID: string, config: setupConfigProps) => void;
      };
      apps: {
        checkout: {
          closeFlow: (url: string) => void;
        };
      };
    };
    paypalCheckoutReady: () => void;
  }
}
