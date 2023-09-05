import { throwResponseError } from '@/utils/index';
import { RESET_PASSWORD_ENDPOINT } from './constants';

export class Account {
  public static async requestResetPasswordEmail(email: string) {
    return request('/api/v5/account/reset_password_token.json', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'account[email]': email,
      }),
    });
  }

  public static async resetPassword({
    password,
    passwordConfirmation,
    invalidateSessions,
    token,
  }: ResetPasswordParams) {
    return request(RESET_PASSWORD_ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'account[password]': password,
        'account[password_confirmation]': passwordConfirmation,
        'account[invalidate_sessions]': invalidateSessions.toString(),
        password_reset_token: token,
      }),
    });
  }

  public static async sendCancellationRequest() {
    return request('/api/v5/account/cancel', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
  }
}

interface ResetPasswordParams {
  password: string;
  passwordConfirmation: string;
  invalidateSessions: boolean;
  token: string;
}

async function handleErrors(response: Response) {
  if (response.status === 400) {
    const data = await response.json();
    const message = data.account?.errors
      ? data.account.errors[0]
      : data.account.messages[0];
    throwResponseError(message, response);
  } else {
    throwResponseError('Error fetching account info', response);
  }
}

// TODO: Should we merge this stuff with the other request helpers?
async function request(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      await handleErrors(response);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Promise.reject({ error: err.message });
    }
  }
}
