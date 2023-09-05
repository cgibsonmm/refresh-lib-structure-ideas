import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { receiptsResponse, receiptsResponseProcessed } from '@/mocks/receipts';
import { server } from '@/mocks/server';
import {
  createWrapper,
  disableReactQueryErrorLogs,
  createQueryClient,
} from '@/utils/TestUtils';
import { useReceipts } from './useReceipts';

disableReactQueryErrorLogs();

// mock fetch response in useReceipts
test('Should fire an ajax request to get the receipts', async () => {
  server.use(
    rest.get('/api/v5/receipts', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(receiptsResponse));
    })
  );
  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  const { result } = renderHook(() => useReceipts(), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toEqual(receiptsResponseProcessed);
});
