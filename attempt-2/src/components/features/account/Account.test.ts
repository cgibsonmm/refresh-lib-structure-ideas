import { server } from '@/mocks/server';
import { Account } from './Account';
import { handlers, resolvers, responses } from './mocks';

describe('Account.requestResetPasswordEmail()', () => {
  const requestResetPasswordEmail = Account.requestResetPasswordEmail;
  const testEmail = 'test@example.com';

  const mockHandler = handlers.requestResetPasswordEmail;
  const mockResolvers = resolvers.requestResetPasswordEmail;
  const mockResponses = responses.requestResetPasswordEmail;

  test('request reset email: success response', async () => {
    server.use(mockHandler(mockResolvers.default));
    const response = await requestResetPasswordEmail(testEmail);
    expect(response).toEqual(mockResponses.success);
  });

  test('request reset email: network error', async () => {
    server.use(mockHandler(mockResolvers.networkError));
    await expect(requestResetPasswordEmail(testEmail)).rejects.toEqual({
      error: 'Network request failed',
    });
  });

  test('request reset email: bad request error', async () => {
    server.use(mockHandler(mockResolvers.badRequest));
    await expect(requestResetPasswordEmail(testEmail)).rejects.toEqual({
      error: 'Missing Parameters Bad Request',
    });
  });

  test('request reset email: server error', async () => {
    server.use(mockHandler(resolvers.requestResetPasswordEmail.serverError));
    await expect(requestResetPasswordEmail(testEmail)).rejects.toEqual({
      error: 'Error fetching account info Internal Server Error',
    });
  });
});

describe('Account.resetPassword()', () => {
  const resetPassword = Account.resetPassword;

  test('reset password: network error', async () => {
    server.use(handlers.resetPassword(resolvers.resetPassword.networkError));
    const testPassword = 'INVALID_TEST_PASSWORD';
    const testToken = 'INVALID_TEST_TOKEN';
    const params = {
      password: testPassword,
      passwordConfirmation: testPassword,
      invalidateSessions: true,
      token: testToken,
    };
    await expect(resetPassword(params)).rejects.toEqual({
      error: 'Network request failed',
    });
  });

  test('reset password: server error', async () => {
    server.use(handlers.resetPassword(resolvers.resetPassword.serverError));
    const testPassword = 'INVALID_TEST_PASSWORD';
    const testToken = 'INVALID_TEST_TOKEN';
    const params = {
      password: testPassword,
      passwordConfirmation: testPassword,
      invalidateSessions: true,
      token: testToken,
    };
    await expect(resetPassword(params)).rejects.toEqual({
      error: 'Error fetching account info Internal Server Error',
    });
  });

  test('reset password: bad request error', async () => {
    server.use(handlers.resetPassword(resolvers.resetPassword.badRequest));
    const testPassword = 'INVALID_TEST_PASSWORD';
    const testToken = 'INVALID_TEST_TOKEN';
    const params = {
      password: testPassword,
      passwordConfirmation: testPassword,
      invalidateSessions: true,
      token: testToken,
    };
    await expect(resetPassword(params)).rejects.toEqual({
      error:
        'The reset token has expired. Please try to reset your password again. Bad Request',
    });
  });

  test('reset password: success response', async () => {
    server.use(handlers.resetPassword(resolvers.resetPassword.default));
    const testPassword = 'VALID_TEST_PASSWORD';
    const testToken = 'VALID_TEST_TOKEN';
    const params = {
      password: testPassword,
      passwordConfirmation: testPassword,
      invalidateSessions: true,
      token: testToken,
    };

    const response = await resetPassword(params);
    await expect(response).toEqual(responses.resetPassword.success);
  });
});

describe('Account.sendCancellationRequest()', () => {
  const sendCancellationRequest = Account.sendCancellationRequest;

  const mockHandler = handlers.sendCancellationRequest;
  const mockResolvers = resolvers.sendCancellationRequest;
  const mockResponses = responses.sendCancellationRequest;

  test('request cancellation: success response', async () => {
    server.use(mockHandler(mockResolvers.default));
    const response = await sendCancellationRequest();
    expect(response).toEqual(mockResponses.success);
  });

  test('request cancellation: network error', async () => {
    server.use(mockHandler(mockResolvers.networkError));
    await expect(sendCancellationRequest()).rejects.toEqual({
      error: 'Network request failed',
    });
  });

  test('request cancellation: bad request error', async () => {
    server.use(mockHandler(mockResolvers.badRequest));
    await expect(sendCancellationRequest()).rejects.toEqual({
      error: 'Could not cancel account Bad Request',
    });
  });
});
