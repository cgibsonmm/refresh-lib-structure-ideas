import { useMutation, useQueryClient } from 'react-query';
import { request } from '@/utils/requestHelpers';

//Hook to add paypal agreement.
//Params: paypal_token.
const addPaypalAgreement = async (formData: URLSearchParams) => {
  return await request('/api/v5/paypal_payment_agreements', {
    headers: new Headers({
      'content-type': 'application/x-www-form-urlencoded',
    }),
    method: 'POST',
    body: formData,
  });
};

export function useCreatePaypalAgreement() {
  const queryClient = useQueryClient();
  return useMutation(addPaypalAgreement, {
    onSuccess: (data) => {
      if (data?.meta?.status) {
        queryClient.invalidateQueries({ queryKey: ['getPaymentMethod'] });
      }
    },
  });
}

//Hook to toogle paypal active.
export function setDefaultPaypalAgreement(paypalID: number) {
  const defaultBody: Record<string, string> = { active: true.toString() };
  const defaultURLBody = new URLSearchParams(defaultBody);
  return request(`/api/v5/paypal_payment_agreements/${paypalID}`, {
    headers: new Headers({
      'content-type': 'application/x-www-form-urlencoded',
    }),
    method: 'PATCH',
    body: defaultURLBody,
  });
}
