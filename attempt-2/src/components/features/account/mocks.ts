import { rest } from 'msw';
import { mockResolvers } from '@/utils/TestUtils';
import { fetchAccountMock } from './account.mock';
import {
  RESET_PASSWORD_ENDPOINT,
  REQUEST_RESET_PASSWORD_EMAIL_ENDPOINT,
} from './constants';
import { FETCH_ACCOUNT_ENDPOINT } from './useAccount';
import { UPDATE_SETTING_ENDPOINT } from './useUserSetting';
import type { RestRequest, RestContext, ResponseResolver } from 'msw';

const requestResetPasswordEmailResponses = {
  success: {
    account: {
      message:
        'Great. We will send you instructions if an account with that email exists.',
    },
    meta: { status: 200 },
  },
  badRequest: {
    account: { errors: ['Missing Parameters'] },
    meta: { status: 400 },
  },
};

const fetchAccountResponses = {
  success: fetchAccountMock,
  badRequest: {
    account: { errors: ['Missing Parameters'] },
    meta: { status: 400 },
  },
};

const updateSettingResponses = {
  success: {
    message: 'Ok',
    meta: { status: 200 },
  },
  badRequest: {
    message: 'Bad Request',
    meta: { status: 400 },
  },
};

const resetPasswordResponses = {
  success: {},
  badRequest: {
    account: {
      messages: [
        'The reset token has expired. Please try to reset your password again.',
      ],
    },
    meta: { status: 400 },
  },
};

const sendCancellationRequestResponses = {
  success: {},
  badRequest: {
    account: {
      messages: ['Could not cancel account'],
    },
  },
};

const requestResetPasswordEmailResolvers = mockResolvers(
  requestResetPasswordEmailResponses,
  {
    default: async (req, res, ctx) => {
      const body = await req.arrayBuffer();
      const parsedBody = new URLSearchParams(body.toString());

      const isInvalidContentType =
        req.headers.get('Content-Type') !== 'application/x-www-form-urlencoded';
      const isMissingBody = !parsedBody;
      // Because of how we're parsing the request body here, undefined email values were being converted to the string "undefined," and failing to trigger the error response. Adding an extra check for the literal string "undefined" solves the issue, but this may be an indication that we should be parsing 'x-www-form-urlencoded' requests differently in our mocks. - c.j.
      const isMissingEmail =
        parsedBody.get('account[email]') === (undefined || 'undefined');
      const isInvalidRequest =
        isInvalidContentType || isMissingBody || isMissingEmail;

      if (isInvalidRequest)
        return res(
          ctx.status(400),
          ctx.json(requestResetPasswordEmailResponses.badRequest)
        );
      else
        return res(
          ctx.status(200),
          ctx.json(requestResetPasswordEmailResponses.success)
        );
    },
  }
);

const resetPasswordResolvers = mockResolvers(resetPasswordResponses, {
  default: async (req, res, ctx) => {
    const validPassword = 'VALID_TEST_PASSWORD';
    const validToken = 'VALID_TEST_TOKEN';
    const body = await req.arrayBuffer();
    const parsedBody = new URLSearchParams(body.toString());
    const isInvalidContentType =
      req.headers.get('Content-Type') !== 'application/x-www-form-urlencoded';
    const hasInvalidParams =
      parsedBody.get('account[password]') !== validPassword ||
      parsedBody.get('account[password_confirmation]') !== validPassword ||
      parsedBody.get('password_reset_token') !== validToken;
    const isInvalidRequest = isInvalidContentType || hasInvalidParams;
    if (isInvalidRequest)
      return res(ctx.status(400), ctx.json(resetPasswordResponses.badRequest));
    else return res(ctx.status(200), ctx.json(resetPasswordResponses.success));
  },
});

const sendCancellationRequestResolvers = mockResolvers(
  sendCancellationRequestResponses,
  {
    default: async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(sendCancellationRequestResponses.success)
      );
    },
  }
);

const fetchAccountResolvers = mockResolvers(fetchAccountResponses);

type MockResolver = ResponseResolver<RestRequest<URLSearchParams>, RestContext>;

function requestResetPasswordEmailHandler(resolver: MockResolver) {
  return rest.post(REQUEST_RESET_PASSWORD_EMAIL_ENDPOINT, resolver);
}

function resetPasswordHandler(resolver: MockResolver) {
  return rest.post(RESET_PASSWORD_ENDPOINT, resolver);
}

function fetchAccountHandler(resolver: MockResolver) {
  const fetchAccountUrl = FETCH_ACCOUNT_ENDPOINT;
  return rest.get(fetchAccountUrl, resolver);
}

const updateSettingResolvers = mockResolvers(updateSettingResponses);

function updateSettingHandler(resolver: MockResolver) {
  const updateSettingUrl = UPDATE_SETTING_ENDPOINT;
  return rest.patch(updateSettingUrl, resolver);
}

function sendCancellationRequestHandler(resolver: MockResolver) {
  const sendCancellationRequestUrl = '/api/v5/account/cancel';
  return rest.post(sendCancellationRequestUrl, resolver);
}

export const handlers = {
  requestResetPasswordEmail: requestResetPasswordEmailHandler,
  resetPassword: resetPasswordHandler,
  fetchAccount: fetchAccountHandler,
  updateSetting: updateSettingHandler,
  sendCancellationRequest: sendCancellationRequestHandler,
};

export const resolvers = {
  requestResetPasswordEmail: requestResetPasswordEmailResolvers,
  resetPassword: resetPasswordResolvers,
  fetchAccount: fetchAccountResolvers,
  updateSetting: updateSettingResolvers,
  sendCancellationRequest: sendCancellationRequestResolvers,
};

export const responses = {
  requestResetPasswordEmail: requestResetPasswordEmailResponses,
  resetPassword: resetPasswordResponses,
  fetchAccount: fetchAccountResponses,
  updateSetting: updateSettingResponses,
  sendCancellationRequest: sendCancellationRequestResponses,
};
