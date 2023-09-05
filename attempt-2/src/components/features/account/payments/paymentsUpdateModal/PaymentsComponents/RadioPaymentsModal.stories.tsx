import { Meta, StoryObj } from '@storybook/react';
import { rest } from 'msw';
import { fetchAccountMock } from '@/account/account.mock';
import { RadioPaymentsModal } from '@/account/payments/paymentsUpdateModal/PaymentsComponents/RadioPaymentsModal';
import { client_token, prep_iframe } from '@/mocks/RadioPaymentsMocks';

const meta: Meta<typeof RadioPaymentsModal> = {
  title: 'Features/Payments/RadioPayments',
  component: RadioPaymentsModal,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
    sessionProvider: true,
    msw: {
      handlers: [
        rest.get('/api/v5/account', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(fetchAccountMock));
        }),
        rest.get('/api/v5/account/prep_iframe.json', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(prep_iframe));
        }),
        rest.get('/api/v5/braintree_client_token', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(client_token));
        }),
      ],
    },
  },
  args: {
    isOpen: true,
  },
};

export default meta;

type Story = StoryObj<typeof RadioPaymentsModal>;

export const Default: Story = {};
