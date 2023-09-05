import { useContext } from 'react';
import { useQuery } from 'react-query';
import { AppConfig } from '@/context/AppConfig';
import { throwResponseError } from '@/utils/index';
import { AccountResponse } from './Interfaces';

export const FETCH_ACCOUNT_ENDPOINT = '/api/v5/account';

async function fetchAccount() {
  const headers = new Headers({
    'content-type': 'application/x-www-form-urlencoded',
  });

  const response = await fetch(FETCH_ACCOUNT_ENDPOINT, {
    method: 'GET',
    headers,
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    await handleErrors(response);
  }
}

async function handleErrors(response: Response) {
  if (response.status === 400) {
    const data = await response.json();
    const message = data.account.errors[0];
    throwResponseError(message, response);
  } else {
    throwResponseError('Error fetching account', response);
  }
}

export function useAccount(isAuthenticated: boolean) {
  const { logError } = useContext(AppConfig);

  return useQuery<AccountResponse, Error>(
    ['account'],
    async () => {
      return fetchAccount();
    },
    {
      onError: (error) => {
        logError('Error fetching account', error);
      },
      enabled: isAuthenticated,
    }
  );
}
