import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { prep_iframe } from '@/mocks/RadioPaymentsMocks';
import { server } from '@/mocks/server';
import {
  createWrapper,
  disableReactQueryErrorLogs,
  createQueryClient,
} from '@/utils/TestUtils';
import { useGetTokenExIframeSrc } from './TokenExService';

disableReactQueryErrorLogs();

interface MyGlobal {
  TokenEx: {
    Iframe: () => {
      load: () => void;
    };
  };
}

test('Should fire an ajax request to get the tokenExIframe', async () => {
  const globalObject = global as unknown as MyGlobal;

  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(prep_iframe),
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

  server.use(
    rest.get('/api/v5/account/prep_iframe.json', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(prep_iframe));
    })
  );

  const mockIframe = {
    load: () => Promise.resolve({ json: () => Promise.resolve(prep_iframe) }),
  };

  globalObject.TokenEx = {
    Iframe: jest.fn().mockReturnValue(mockIframe),
  };

  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  const { result } = renderHook(() => useGetTokenExIframeSrc(), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(globalObject.TokenEx.Iframe).toHaveBeenCalledTimes(1);
});
