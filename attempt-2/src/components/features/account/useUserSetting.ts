import { useQuery } from 'react-query';

export const UPDATE_SETTING_ENDPOINT = '/api/v5/user_settings';

export type SettingProps = {
  setting: string;
  state: boolean;
};

export interface SettingData {
  [key: string]: unknown;
}

export async function updateSetting(
  settingData: SettingProps
): Promise<SettingData | never> {
  const headers = new Headers({
    'content-type': 'application/x-www-form-urlencoded',
  });

  const response = await fetch(UPDATE_SETTING_ENDPOINT, {
    method: 'PATCH',
    headers,
    body: new URLSearchParams({
      setting: settingData.setting || '',
      setting_state: `${settingData.state}` || '',
    }),
  });

  try {
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const data = await response.json();
      const message = data.account.errors[0] || 'An unexpected error occurred.';
      throw new Error(message);
    }
  } catch {
    throw new Error('An unexpected error occurred.');
  }
}

export function useSetting({ setting, state }: SettingProps) {
  return useQuery('updateSetting', async () => {
    return await updateSetting({
      setting,
      state,
    });
  });
}
