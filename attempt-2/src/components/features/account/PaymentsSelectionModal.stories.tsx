import { StoryObj, Meta } from '@storybook/react';
import { rest } from 'msw';
import { fetchAccountMock } from '@/account/account.mock';
import { paymentMethodsResponse } from '@/mocks/paymentMethods';
import { PaymentsSelectionModal } from './PaymentsSelectionModal';

const meta: Meta<typeof PaymentsSelectionModal> = {
  title: 'Features/Payments/PaymentsSelectionModal',
  component: PaymentsSelectionModal,
  parameters: {
    sessionProvider: true,
    docs: {
      story: {
        inline: false,
        iframeHeight: 600,
      },
    },
    msw: {
      handlers: [
        rest.get('/api/v5/payment_methods', (req, res, ctx) => {
          return res(ctx.json(paymentMethodsResponse));
        }),
        rest.get('/api/v5/account', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(fetchAccountMock));
        }),
      ],
    },
  },
  argTypes: {
    onClose: { action: 'onClose' },
    onAddPaymentMethod: { action: 'onAddPaymentMethod' },
    onSelectedPaymentMethod: { action: 'onSelectedPaymentMethod' },
  },
  args: {
    open: true,
  },
};

export default meta;

type Story = StoryObj<typeof PaymentsSelectionModal>;

export const Default: Story = {};

export const WithCustomCta: Story = {
  args: {
    cta: 'Hello World',
  },
};

export const InReactivation: Story = {
  args: {
    inReactivation: true,
  },
};
