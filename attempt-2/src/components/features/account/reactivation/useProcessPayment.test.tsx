import { act, renderHook } from '@testing-library/react';
import { rest } from 'msw';
import * as useSubscriptionUpgrade from '@/account/payments/useSubscriptionUpgrade';
import { server } from '@/mocks/server';
import { createQueryClient, createWrapper } from '@/utils/TestUtils';
import { useProcessPayment } from './useProcessPayment';
import { SubscriptionPlan } from '../Interfaces';

describe('useProcessPayment', () => {
  const useReactivateAccountTimeLeftMock = jest.spyOn(
    useSubscriptionUpgrade,
    'useReactivateAccountTimeLeft'
  );

  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  it('should handle reactivation when account has time left', async () => {
    server.use(
      rest.post('api/v5/subscription/reactivate.json', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
      rest.post('api/v5/payments/paypal_payment.json', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      })
    );

    const { result } = renderHook(() => useProcessPayment(), { wrapper });

    await act(async () => {
      await result.current.processPayment(
        '3000-01-01',
        mockPayment,
        true,
        mockPlan
      );

      expect(useReactivateAccountTimeLeftMock).toHaveBeenCalled();
    });
  });

  it('should process paypal payment', async () => {
    const useProcessPaypalMock = jest.spyOn(
      useSubscriptionUpgrade,
      'useProcessPayPal'
    );

    server.use(
      rest.post('api/v5/subscription/reactivate.json', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
      rest.post('api/v5/payments/paypal_payment.json', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      })
    );

    const { result } = renderHook(() => useProcessPayment(), { wrapper });

    await act(async () => {
      await result.current.processPayment(
        '1999-01-01',
        mockPayment,
        true,
        mockPlan
      );

      expect(useProcessPaypalMock).toHaveBeenCalled();
    });
  });

  it('should process card payment', async () => {
    const useProcessCardMock = jest.spyOn(
      useSubscriptionUpgrade,
      'useProcessCard'
    );

    server.use(
      rest.post('api/v5/subscription/reactivate.json', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }),
      rest.post('api/v5/payments/credit_card_payment.json', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      })
    );

    const { result } = renderHook(() => useProcessPayment(), { wrapper });
    await act(async () => {
      await result.current.processPayment(
        '1999-01-01',
        { ...mockPayment, card_type: 'visa' },
        true,
        mockPlan
      );

      expect(useProcessCardMock).toHaveBeenCalled();
    });
  });
});

const mockPayment = {
  card_type: 'paypal',
  id: 123,
  active: true,
  city: 'New York',
  country: 'US',
  state: 'NY',
  expiration_month: 1,
  expiration_year: 3000,
  last_four: '1234',
  email: 'adam@ltvco.com',
  masked_card_number: '1234',
  first_name: 'Adam',
  last_name: 'Smith',
  payer_id: '1234',
  street1: 'name',
  payer_status: 'valid',
  postal_code: '12345',
  description: '',
  braintree_type: '',
  token: '',
  payment_type: '',
};

const mockPlan: SubscriptionPlan = {
  name: 'Basic',
  unique_key: 'basic',
  amazon_id: '123',
  amount: 100,
  app_only: 'false',
  apple_id: '123',
  google_id: '123',
  title: 'Basic',
  subtitle: 'Basic',
  recurring: true,
  renewal_period: 30,
  renewal_period_type: 'day',
  report_tier: 'basic',
  internal_name: 'basic',
  discount: null,
  public_price_description: '$1.00 / month',
  default: false,
  monthly_report_limit: 1000,
};
