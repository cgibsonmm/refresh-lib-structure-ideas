import { Meta, StoryObj } from '@storybook/react';
import { rest } from 'msw';
import { fetchAccountMock } from '@/account/account.mock';
import { paymentMethodsResponse } from '@/mocks/paymentMethods';
import { reactivationPlansResponse } from '@/mocks/reactivationPlans';
import { Reactivation } from './Reactivation';

const meta: Meta<typeof Reactivation> = {
  title: 'Features/Reactivation/Reactivation',
  component: Reactivation,
  parameters: {
    sessionProvider: true,
    msw: {
      handlers: [
        rest.get('/api/v5/payment_methods', (req, res, ctx) => {
          return res(ctx.json(paymentMethodsResponse));
        }),
        rest.get('/api/v5/account', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(fetchAccountMock));
        }),
        rest.get(
          '/api/v5/subscription/reactivation_limited_options.json',
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(reactivationPlansResponse));
          }
        ),
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Reactivation>;

export const Default: Story = {};
