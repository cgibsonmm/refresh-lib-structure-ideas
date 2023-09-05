import { StoryObj, Meta } from '@storybook/react';
import { rest } from 'msw';
import { fetchAccountMock } from '@/account/account.mock';
import { ViewOrderHistory } from '@/account/payments/ViewOrderHistory';
import { receiptsResponse } from '@/mocks/receipts';

const meta: Meta<typeof ViewOrderHistory> = {
  title: 'Features/Payments/ViewOrderHistory',
  component: ViewOrderHistory,
  parameters: {
    sessionProvider: true,
    msw: {
      handlers: [
        rest.get('/api/v5/receipts', (req, res, ctx) => {
          return res(ctx.json(receiptsResponse));
        }),
        rest.get('/api/v5/account', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(fetchAccountMock));
        }),
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ViewOrderHistory>;

export const Default: Story = {};
