import { useMutation, useQueryClient } from 'react-query';
import { request } from '@/utils/requestHelpers';

const BRAINTREE_URL = '/api/v5/braintree_payment_methods';

//Hook to create a braintree payment method.
const createBraintreePaymentMethod = (formParams: {
  postalCode: string;
  nonce: string;
}) => {
  const formData = new URLSearchParams();
  formData.set('postal_code', formParams.postalCode);
  formData.set('nonce', formParams.nonce);
  return request(BRAINTREE_URL, {
    headers: new Headers({
      'content-type': 'application/x-www-form-urlencoded',
    }),
    method: 'POST',
    body: formData,
  });
};

export function useCreateBraintreePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation(createBraintreePaymentMethod, {
    onSuccess: (data) => {
      if (data?.meta?.status) {
        queryClient.invalidateQueries({ queryKey: ['getPaymentMethod'] });
      }
    },
  });
}

//Hook to set a default braintreePayment
export function setDefaultBraintreePayment(paymentMethodID: number) {
  const formData = new URLSearchParams();
  formData.set('active', String(true));
  return request(`${BRAINTREE_URL}/${paymentMethodID}`, {
    headers: new Headers({
      'content-type': 'application/x-www-form-urlencoded',
    }),
    method: 'PATCH',
    body: formData,
  });
}
