import { useEffect } from 'react';
import { AppConfig } from '@/context/AppConfig';
import { useRedirect } from '@/utils/hooks/useRedirect';
import { useAccount } from '../useAccount';

type ReactivationProps = {
  isAuthenticated?: boolean;
  currentPathName?: string;
  reactivationPath?: string;
};

export function useReactivation({
  isAuthenticated = true,
  currentPathName,
  reactivationPath = '/reactivation',
}: ReactivationProps) {
  const { data } = useAccount(isAuthenticated);
  const { redirect } = useRedirect(AppConfig);

  const renewalDate = new Date(
    data?.account?.subscription_info?.normalize_date || ''
  );
  const hasReactivationNotification =
    data?.account?.notification?.type === 'reactivation';
  const nonCompliant = data?.account?.user_info?.noncompliant;

  const accountInPassedDueState = () => {
    const currentDate = new Date();
    const accountIsPastDue = renewalDate.getTime() < currentDate.getTime();
    return accountIsPastDue && hasReactivationNotification && !nonCompliant;
  };

  useEffect(() => {
    if (data?.account) {
      if (accountInPassedDueState() && currentPathName !== reactivationPath) {
        redirect(reactivationPath);
      }
    }
  }, [data?.account]);

  return { shouldRedirectOutOfReactivation: !accountInPassedDueState() };
}
