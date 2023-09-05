import { renderHook, waitFor } from '@testing-library/react';
import { server } from '@/mocks/server';
import {
  createWrapper,
  disableReactQueryErrorLogs,
  createQueryClient,
} from '@/utils/TestUtils';
import { fetchAccountMock } from './account.mock';
import { handlers, resolvers } from './mocks';
import { useAccount } from './useAccount';

disableReactQueryErrorLogs();

test('When the reports data is fetched successfully, it sets the success state & returns the account data', async () => {
  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);
  server.use(handlers.fetchAccount(resolvers.fetchAccount.default));

  const { result } = renderHook(() => useAccount(true), { wrapper });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
  expect(result.current.data).toEqual(fetchAccountMock);
});
