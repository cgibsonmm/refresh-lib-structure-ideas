import { renderHook } from '@testing-library/react';
import { rest } from 'msw';
import { act } from 'react-dom/test-utils';
import { prep_iframe } from '@/mocks/RadioPaymentsMocks';
import { server } from '@/mocks/server';
import {
  createWrapper,
  disableReactQueryErrorLogs,
  createQueryClient,
} from '@/utils/TestUtils';
import { useBraintreeClient } from './BraintreeClientService';

disableReactQueryErrorLogs();

test('Should fire an ajax request to get the client token', async () => {
  server.use(
    rest.get('/api/v5/braintree_client_token', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(prep_iframe));
    })
  );

  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({}),
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      body: null,
      bodyUsed: false,
      type: 'basic',
      url: 'https://example.com',
    })
  );

  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  await act(async () => {
    renderHook(() => useBraintreeClient(), { wrapper });
  });

  expect(fetch).toHaveBeenCalledTimes(1);
});

test('should create the client instance and call the readyHandler when getClientInstance is called', async () => {
  const readyHandler = jest.fn();
  jest.useFakeTimers();

  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  const { result } = renderHook(() => useBraintreeClient(), { wrapper });

  await act(async () => {
    await result.current.getClientInstance(readyHandler);
  });

  expect(result.current.clientInstance.current).toBeDefined();
  expect(readyHandler).toHaveBeenCalled();
});
