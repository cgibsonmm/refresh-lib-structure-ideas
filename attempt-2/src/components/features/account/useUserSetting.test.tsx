import { renderHook, waitFor } from '@testing-library/react';
import { handlers, resolvers } from '@/account/mocks';
import { useSetting, SettingProps } from '@/account/useUserSetting';
import { server } from '@/mocks/server';
import {
  createWrapper,
  disableReactQueryErrorLogs,
  createQueryClient,
} from '@/utils/TestUtils';

disableReactQueryErrorLogs();

test('When the user sets a setting property', async () => {
  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);
  server.use(handlers.updateSetting(resolvers.updateSetting.default));

  // Any setting property we want to set, in this case we use hide_criminal_records
  const data: SettingProps = {
    setting: 'hide_criminal_records',
    state: true,
  };

  const { result } = renderHook(() => useSetting(data), { wrapper });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
});
