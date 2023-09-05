import { renderHook, RenderHookOptions, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { act } from 'react-dom/test-utils';
import { QueryClient, QueryClientProvider } from 'react-query';
import { server } from '@/mocks/server';
import {
  createQueryClient,
  disableReactQueryErrorLogs,
} from '@/utils/TestUtils';
import {
  useCreatePaypalAgreement,
  setDefaultPaypalAgreement,
} from './paypalService';
disableReactQueryErrorLogs();

test('When Core response with a 200 and successful added a paypal agreement', async () => {
  server.use(
    rest.post('/api/v5/paypal_payment_agreements', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({}));
    })
  );

  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  const { result } = renderHook(() => useCreatePaypalAgreement(), { wrapper });

  act(() => {
    result.current.mutate(new URLSearchParams({ paypal_token: 'test-token' }));
  });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});

test('When Core response with an error, it sets the failure state & provides an error message', async () => {
  server.use(
    rest.post('/api/v5/paypal_payment_agreements', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({}));
    })
  );

  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  const { result } = renderHook(() => useCreatePaypalAgreement(), { wrapper });

  act(() => {
    result.current.mutate(new URLSearchParams({ paypal_token: 'test-token' }));
  });

  await waitFor(() => expect(result.current.isError).toBe(true));
});

test('When Core response with a 200 and successful toggle a paypal agreement', async () => {
  server.use(
    rest.patch(
      '/api/v5/paypal_payment_agreements/:paypalId',
      (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      }
    )
  );

  const result = await setDefaultPaypalAgreement(1);

  expect(result).toEqual({});
});

test('When there is an error setting the default paypal agreement, it sets the failure state & provides an error message', async () => {
  server.use(
    rest.patch(
      '/api/v5/paypal_payment_agreements/:reportId',
      (req, res, ctx) => {
        return res(ctx.status(404), ctx.json({}));
      }
    )
  );

  const error = { error: 'Request error Not Found' };

  await expect(setDefaultPaypalAgreement(1)).rejects.toEqual(error);
});

function createWrapper(queryClient: QueryClient) {
  const wrapper: RenderHookOptions<{ reportId: string }>['wrapper'] = ({
    children,
  }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return wrapper;
}
