import { useQuery, useMutation, useQueryClient } from 'react-query';
import { request } from '@/utils/requestHelpers';

//Hook to get all credit cards.
export function useGetCreditCards() {
  return useQuery(['getCreditCards'], async () => {
    return await request('/api/v5/credit_cards', {
      headers: new Headers({
        'content-type': 'application/x-www-form-urlencoded',
      }),
      method: 'GET',
    });
  });
}

//Hook to create a credit card.
const addCreditDebitCard = (formData: URLSearchParams) => {
  return request('/api/v5/credit_cards', {
    headers: new Headers({
      'content-type': 'application/x-www-form-urlencoded',
    }),
    method: 'POST',
    body: formData,
  });
};

export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation(addCreditDebitCard, {
    onSuccess: (data) => {
      if (data?.meta?.status) {
        queryClient.invalidateQueries({ queryKey: ['getPaymentMethod'] });
      }
    },
  });
}

//Hook to set a default credit card.
export function setDefaultCreditCard(creditCardId: number) {
  const defaultBody: Record<string, string> = {
    ['credit_card[active]']: true.toString(),
  };
  const defaultURLBody = new URLSearchParams(defaultBody);
  return request(`/api/v5/credit_cards/${creditCardId}`, {
    headers: new Headers({
      'content-type': 'application/x-www-form-urlencoded',
    }),
    method: 'PATCH',
    body: defaultURLBody,
  });
}

//Hook to get the default credit card.
export function useGetDefaultCreditCard() {
  return useQuery('getDefaultCreditCard', async () => {
    const { credit_cards } = await request('/api/v5/credit_card', {
      headers: new Headers({
        'content-type': 'application/x-www-form-urlencoded',
      }),
      method: 'GET',
    });
    return credit_cards.find((card: { active: boolean }) => card.active);
  });
}
