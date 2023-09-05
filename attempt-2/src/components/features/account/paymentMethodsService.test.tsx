import {
  renderHook,
  RenderHookOptions,
  waitFor,
  act,
} from '@testing-library/react';
import { rest } from 'msw';
import { QueryClient, QueryClientProvider } from 'react-query';
import { getPaymentMethodsHandler } from '@/mocks/handlers';
import { server } from '@/mocks/server';
import {
  createQueryClient,
  disableReactQueryErrorLogs,
} from '@/utils/TestUtils';
import {
  useGetPaymentMethod,
  SetDefaultMethodPaymentTest,
} from './paymentMethodsService';

disableReactQueryErrorLogs();

const voidFunction = () => {
  return {};
};

test('When Core response with a 200 and successful fetch all payment methods', async () => {
  server.use(getPaymentMethodsHandler);

  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  const { result } = renderHook(() => useGetPaymentMethod(), { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});

test('When Core response with an error fetching payment methods, it sets the failure state & provides an error message', async () => {
  server.use(
    rest.get('/api/v5/payment_methods', (req, res, ctx) => {
      return res(ctx.status(404), ctx.json({ payment_methods: [] }));
    })
  );

  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  const { result } = renderHook(() => useGetPaymentMethod(), { wrapper });
  await waitFor(() => expect(result.current.isError).toBe(true));
});

test('When Core response with a 200 and successful toggle default payment method', async () => {
  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  const testPaymentMethod = {
    payment_type: 'visa',
    id: 1,
  };

  const { result } = renderHook(
    () => SetDefaultMethodPaymentTest(voidFunction, voidFunction),
    { wrapper }
  );

  act(() => {
    result.current.mutate(testPaymentMethod);
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});

test('When Core response with an error toggling. payment methods, it sets the failure state & provides an error message', async () => {
  server.use(
    rest.patch(
      '/api/v5/paypal_payment_agreements/:paypalId',
      (req, res, ctx) => {
        return res(ctx.status(404), ctx.json({}));
      }
    ),
    rest.patch('/api/v5/credit_cards/:card_id', (req, res, ctx) => {
      return res(ctx.status(404), ctx.json({}));
    })
  );

  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  //Paypal Test
  const testPaymentMethodPaypal = {
    payment_type: 'paypal',
    id: 1,
  };
  const { result: paypalResult } = renderHook(
    () => SetDefaultMethodPaymentTest(voidFunction, voidFunction),
    { wrapper }
  );

  act(() => {
    paypalResult.current.mutate(testPaymentMethodPaypal);
  });

  await waitFor(() => {
    expect(paypalResult.current.isError).toBe(true);
  });

  //Credit Card test
  const testPaymentMethodCreditCard = {
    payment_type: 'card',
    id: 1,
  };

  const { result: creditCardResult } = renderHook(
    () => SetDefaultMethodPaymentTest(voidFunction, voidFunction),
    { wrapper }
  );

  act(() => {
    creditCardResult.current.mutate(testPaymentMethodCreditCard);
  });
  await waitFor(() => expect(creditCardResult.current.isError).toBe(true));
});

function createWrapper(queryClient: QueryClient) {
  const wrapper: RenderHookOptions<{ reportId: string }>['wrapper'] = ({
    children,
  }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return wrapper;
}
