import { renderHook, RenderHookOptions, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RawRecentReportsData } from '@/mocks/RawRecentReportsData';
import { getReportsHandler } from '@/mocks/handlers';
import { server } from '@/mocks/server';
import {
  disableReactQueryErrorLogs,
  createQueryClient,
} from '@/utils/TestUtils';
import { RecentReportsSerializer } from './recentReportsSerializer';
import { useReports } from './useReports';

const serializedData = RecentReportsSerializer({ data: RawRecentReportsData });
const mockReportType = 'all';

disableReactQueryErrorLogs();

test('When the reports data is fetched successfully, it sets the success state & returns the reports data', async () => {
  server.use(getReportsHandler);

  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  const { result } = renderHook(() => useReports(mockReportType), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toEqual(serializedData);
});

test('When pass a custom serializer, it calls it', async () => {
  server.use(getReportsHandler);

  const mockSerializer = jest.fn();
  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  const { result } = renderHook(
    () =>
      useReports(mockReportType, 1, {
        serializer: mockSerializer,
      }),
    { wrapper }
  );

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(mockSerializer.mock.calls.length).toBe(1);
});

test('When there is an error fetching reports, it sets the failure state & provides an error message', async () => {
  server.use(
    rest.get('/api/v5/reports', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);

  const { result } = renderHook(() => useReports(mockReportType), { wrapper });

  await waitFor(() => expect(result.current.isError).toBe(true));
  expect(result?.current?.error?.message).toEqual(
    'Error fetching recent reports Internal Server Error'
  );
});

function createWrapper(queryClient: QueryClient) {
  const wrapper: RenderHookOptions<{ reportType: string }>['wrapper'] = ({
    children,
  }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return wrapper;
}
