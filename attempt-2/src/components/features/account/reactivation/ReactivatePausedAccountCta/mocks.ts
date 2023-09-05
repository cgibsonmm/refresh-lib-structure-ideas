import { fetchAccountMock } from '@/account/account.mock';

export const pausedAccountMock = {
  ...fetchAccountMock,
  account: {
    ...fetchAccountMock.account,
    subscription_info: {
      ...fetchAccountMock.account.subscription_info,
      monthly_reports_remaining: 100,
      monthly_report_limit: 100,
    },
  },
  meta: {
    ...fetchAccountMock.meta,
    subscription_state: 'paused',
  },
};
