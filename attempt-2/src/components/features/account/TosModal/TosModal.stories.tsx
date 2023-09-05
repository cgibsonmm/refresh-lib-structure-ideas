import { StoryObj, Meta } from '@storybook/react';
import { rest } from 'msw';
import { fetchAccountMock } from '@/account/account.mock';
import { paymentMethodsResponse } from '@/mocks/paymentMethods';
import { TosModal } from './TosModal';

const meta: Meta<typeof TosModal> = {
  title: 'account/TosModal',
  component: TosModal,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 800,
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
    acceptTos: { action: 'acceptTos' },
    onChangePaymentMethod: { action: 'onChangePaymentMethod' },
  },
  args: {
    open: true,
    showCheckbox: true,
    billingFrecuency: 'every month',
    billedPrice: '$12',
  },
};
export default meta;

type Story = StoryObj<typeof TosModal>;

export const Default: Story = {};

export const WithoutCheckbox: Story = {
  args: {
    showCheckbox: false,
  },
};

export const WithPaymentMethod: Story = {
  args: {
    showPaymentMethod: true,
  },
};
WithPaymentMethod.parameters = {
  sessionProvider: true,
};

export const WithCustomCta: Story = {
  args: {
    cta: { text: 'Hello World' },
  },
};
