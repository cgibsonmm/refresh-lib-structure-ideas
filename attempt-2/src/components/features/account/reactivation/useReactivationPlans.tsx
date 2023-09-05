import { useContext } from 'react';
import { useQuery } from 'react-query';
import { AppConfig } from '@/context/AppConfig';

const URL = `/api/v5/subscription/reactivation_limited_options.json`;

const fetchReactivationPlans = async () => {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    return data.subscription.reactivation_limited_options;
  } catch (error) {
    throw new Error('Error fetching reactivation plans: ${error}');
  }
};

export function useReactivationPlans() {
  const { logError } = useContext(AppConfig);
  const result = useQuery('reactivationPlans', fetchReactivationPlans, {
    onError: (error) => {
      logError('Error fetching reactivation plans', error as Error);
    },
  });

  return { ...result };
}
