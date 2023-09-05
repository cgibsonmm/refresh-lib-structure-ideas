import {
  act,
  renderHook,
  RenderHookOptions,
  waitFor,
} from '@testing-library/react';
import { rest } from 'msw';
import { QueryClient, QueryClientProvider } from 'react-query';
import { server } from '@/mocks/server';
import {
  createQueryClient,
  disableReactQueryErrorLogs,
} from '@/utils/TestUtils';
import {
  useGetCreditCards,
  useCreateCard,
  setDefaultCreditCard,
} from './creditCardService';

disableReactQueryErrorLogs();

test('When Core response with a 202 because it is still fetching all the cards, it retries until the report data is available, then returns the data', async () => {
  server.use(
    rest.get('/api/v5/credit_cards', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({}));
    })
  );

  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);
  const { result } = renderHook(() => useGetCreditCards(), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});

test('When there is an error fetching the cards, it sets the failure state & provides an error message', async () => {
  server.use(
    rest.get('/api/v5/credit_cards', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({}));
    })
  );

  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  const { result } = renderHook(() => useGetCreditCards(), { wrapper });
  await waitFor(() => expect(result.current.isError).toBe(true));
});

test('When Core response with a 200 and create the card', async () => {
  server.use(
    rest.post('/api/v5/credit_cards', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({}));
    })
  );
  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  const { result } = renderHook(() => useCreateCard(), { wrapper });

  act(() => {
    result.current.mutate(new URLSearchParams());
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});

test('When there is an error creating a card, it sets the failure state & provides an error message', async () => {
  server.use(
    rest.post('/api/v5/credit_cards', (req, res, ctx) => {
      return res(ctx.status(400), ctx.json({}));
    })
  );
  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  const { result } = renderHook(() => useCreateCard(), { wrapper });

  act(() => {
    result.current.mutate(new URLSearchParams());
  });

  await waitFor(() => expect(result.current.isError).toBe(true));
});

test('When Core response with a 202 because it is still changing the default card, it retries until the report data is available, then returns the data', async () => {
  server.use(
    rest.patch('/api/v5/credit_cards/:card_id', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({}));
    })
  );

  const result = await setDefaultCreditCard(1);

  expect(result).toEqual({});
});

test('When there is an error changing the default card, it sets the failure state & provides an error message', async () => {
  server.use(
    rest.patch('/api/v5/credit_cards/:card_id', (req, res, ctx) => {
      return res(ctx.status(404), ctx.json({}));
    })
  );

  const error = { error: 'Request error Not Found' };

  await expect(setDefaultCreditCard(1)).rejects.toEqual(error);
});

function createWrapper(queryClient: QueryClient) {
  const wrapper: RenderHookOptions<{ reportId: string }>['wrapper'] = ({
    children,
  }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return wrapper;
}
