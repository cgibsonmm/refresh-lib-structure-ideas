import { useMutation, useQuery } from 'react-query';
import { PaymentMethods } from '@/account/Interfaces';
import { request } from '@/utils/requestHelpers';
import { setDefaultBraintreePayment } from './braintreeService';
import { setDefaultCreditCard } from './creditCardService';
import { setDefaultPaypalAgreement } from './paypalService';

export function useGetPaymentMethod() {
  return useQuery(['getPaymentMethod'], async () => {
    const paymentQuery = await request('/api/v5/payment_methods', {
      headers: new Headers({
        'content-type': 'application/x-www-form-urlencoded',
      }),
      method: 'GET',
    });

    hoistActivePaymentMethod(paymentQuery);
    normalizePaymentMethod(paymentQuery);
    return paymentQuery;
  });
}

const hoistActivePaymentMethod = ({
  payment_methods,
}: {
  payment_methods: PaymentMethods[];
}) => {
  if (!payment_methods) return;
  const activeIndex = payment_methods.findIndex(
    (item: { active: boolean }) => item.active === true
  );
  if (activeIndex === -1) return;
  payment_methods.unshift(payment_methods.splice(activeIndex, 1)[0]);
};

const normalizePaymentMethod = ({
  payment_methods,
}: {
  payment_methods: PaymentMethods[];
}) => {
  payment_methods.forEach((rawPaymentMethod) => {
    if (rawPaymentMethod.last_four) {
      rawPaymentMethod.description = `${rawPaymentMethod.card_type.toUpperCase()} ending in ${
        rawPaymentMethod.last_four
      }`;
    }
  });
};

export const filterActivePaymentMethod = ({
  payment_methods,
}: {
  payment_methods: PaymentMethods[];
}) => {
  if (!payment_methods) return;

  return payment_methods.filter(
    (payment: { active: boolean }) => payment.active
  )[0];
};

//Hook to set default payment method.
export const SetDefaultMethodPaymentTest = (
  refetch: () => void,
  slideTo: (slideNumber: number) => void
) => {
  return useMutation(
    async (paymentMethod: { payment_type: string; id: number }) => {
      if (paymentMethod.payment_type === 'braintree') {
        return await setDefaultBraintreePayment(paymentMethod.id);
      } else if (paymentMethod.payment_type === 'paypal') {
        return await setDefaultPaypalAgreement(paymentMethod.id);
      } else if (paymentMethod.payment_type === 'card') {
        return await setDefaultCreditCard(paymentMethod.id);
      }
    },
    {
      onSuccess: () => {
        refetch();
        slideTo(1);
      },
    }
  );
};
