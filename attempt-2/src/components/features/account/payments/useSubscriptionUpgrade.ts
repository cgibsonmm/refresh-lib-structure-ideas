import { useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AppConfig } from '@/context/AppConfig';
import { request } from '@/utils/requestHelpers';

const UPGRADE_OPTIONS_URL = '/api/v5/subscription/upgrade_options.json';
const UPGRADE_URL = '/api/v5/payments/credit_card_payment.json';
const UPGRADE_URL_PAYPAL = '/api/v5/payments/paypal_payment.json';
const REACTIVATE_URL = '/api/v5/subscription/reactivate.json';
const DOWNSELL_PLAN_SUBSCRIPTIONS_URL =
  '/api/v5/subscription/downsell_options.json';

export function useGetPlans() {
  return useQuery(['getPlans'], () => {
    const upgradeOptionsResponse = request(UPGRADE_OPTIONS_URL, {
      headers: new Headers({
        'content-type': 'application/x-www-form-urlencoded',
      }),
      method: 'GET',
    });
    return upgradeOptionsResponse;
  });
}

export function useGetDownsellPlan() {
  return useQuery(['getDownsellPlan'], () => {
    const downsellPlanResponse = request(DOWNSELL_PLAN_SUBSCRIPTIONS_URL, {
      headers: new Headers({
        'content-type': 'application/x-www-form-urlencoded',
      }),
      method: 'GET',
    });
    return downsellPlanResponse;
  });
}

export const useProcessCard = () => {
  const queryClient = useQueryClient();
  const { logError } = useContext(AppConfig);

  return useMutation(
    ({
      creditCardId,
      plan,
    }: {
      creditCardId: number;
      plan: { unique_key: string };
    }) => {
      const formData = new URLSearchParams();
      formData.set('cart[products][SubscriptionPlan][]', plan.unique_key);
      formData.set('credit_card_id', String(creditCardId));

      return request(
        UPGRADE_URL,
        {
          method: 'POST',
          body: formData,
        },
        undefined,
        _paymentErrorHandler
      );
    },
    {
      onSuccess: (data) => {
        if (data?.meta?.status) {
          queryClient.invalidateQueries({ queryKey: ['account'] });
          queryClient.invalidateQueries({ queryKey: ['getPaymentMethod'] });
        }
      },
      onError: (error: Error) => {
        logError('Error processing credit card payment', error);
      },
    }
  );
};

export const useProcessPayPal = () => {
  const queryClient = useQueryClient();
  const { logError } = useContext(AppConfig);

  return useMutation(
    ({
      paymentAgreementId,
      plan,
    }: {
      paymentAgreementId: number;
      plan: { unique_key: string };
    }) => {
      const formData = new URLSearchParams();
      formData.set('cart[products][SubscriptionPlan][]', plan.unique_key);
      formData.set('paypal[id]', String(paymentAgreementId));

      return request(
        UPGRADE_URL_PAYPAL,
        {
          method: 'POST',
          body: formData,
        },
        undefined,
        _paymentErrorHandler
      );
    },
    {
      onSuccess: (data) => {
        if (data?.meta?.status) {
          queryClient.invalidateQueries({ queryKey: ['account'] });
          queryClient.invalidateQueries({ queryKey: ['getPaymentMethod'] });
        }
      },
      onError: (error: Error) => {
        logError('Error processing PayPal payment', error);
      },
    }
  );
};

export const useReactivateAccountTimeLeft = () => {
  return useMutation((confirm: string) => {
    const formData = new URLSearchParams();
    formData.set('confirm', confirm);
    return request(REACTIVATE_URL, {
      method: 'POST',
      body: formData,
    });
  });
};

const _paymentErrorHandler = async (response: Response): Promise<Error> => {
  const data = await response.json();

  const errors = data.checkout_response?.errors || data.errors || [];

  return Promise.reject(
    new Error(
      `Error processing payment (${response.status} - ${response.statusText})`,
      { cause: errors }
    )
  );
};
