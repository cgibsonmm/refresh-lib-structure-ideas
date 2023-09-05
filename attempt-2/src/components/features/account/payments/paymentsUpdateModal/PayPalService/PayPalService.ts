import { useContext } from 'react';
import { AppConfig } from '@/context/AppConfig';

interface PayPalServiceProps {
  onAfterProcessing: () => void;
  onBeforeProcessing: () => void;
  onError: () => void;
}
export const usePayPalService = ({
  onAfterProcessing,
  onBeforeProcessing,
  onError,
}: PayPalServiceProps) => {
  const { location } = useContext(AppConfig).routingUtils;

  const initPayPal = () => {
    window.paypal.checkout.initXO();
    preflight();

    // legacy checkout closeFlow. This seems to get called
    // if logged into paypal when opening the popup, and
    // then closing the popup. The page doesn't seem
    // to redirect but does seem to call this method.
    const closeFlow = window.paypal.apps.checkout.closeFlow;

    window.paypal.apps.checkout.closeFlow = (url: string) => {
      onAfterProcessing?.();
      closeFlow(url);
    };
  };

  const preflight = async () => {
    onBeforeProcessing?.();

    const returnUrl = getReturnUrl();
    const paypalResponse = await fetch(
      `/api/v5/paypal_settings/url?return_url=${returnUrl}`
    );
    const paypalResponseJson = await paypalResponse.json();

    if (!paypalResponse.ok) {
      onError?.();
      onAfterProcessing?.();
      return;
    }

    onAfterProcessing?.();
    window.location.replace(paypalResponseJson.pp_url);
  };

  const getReturnUrl = () => {
    const currentController = `${location.pathname}${location.search}${location.hash}`;
    const sourceUrl = window.btoa(currentController);
    const rootUrl = getRootUrl(currentController);

    // If testing in local environment, is needed to do it in this way:
    // Uncomment these lines.

    // // Reactivation
    // if (location.pathname === '/reactivation')
    //   return encodeURIComponent(
    //     `${rootUrl}/refresh/reactivation?source=${sourceUrl}`
    //   );
    // // Billing
    // return encodeURIComponent(
    //   `${rootUrl}/refresh/dashboard/billing?source=${sourceUrl}`
    // );

    if (location.pathname === '/reactivation')
      return encodeURIComponent(`${rootUrl}/reactivation?source=${sourceUrl}`);

    return encodeURIComponent(
      `${rootUrl}/dashboard/billing?source=${sourceUrl}`
    );
  };

  const getRootUrl = (sourcePath: string) => {
    if (window.location.hash !== '') {
      return window.location.href.replace(window.location.hash, '#');
    }

    const mappedSourcePath = sourcePath.replace('.', '/');

    return window.location.href
      .replace(mappedSourcePath, '')
      .replace(window.location.search, '')
      .replace('/refresh', '');
  };

  return { initPayPal };
};
