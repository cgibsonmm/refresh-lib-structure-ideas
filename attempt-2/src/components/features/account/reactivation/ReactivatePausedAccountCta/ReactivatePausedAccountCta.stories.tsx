import { Meta, StoryObj } from '@storybook/react';
import { rest } from 'msw';
import { paymentMethodsResponse } from '@/mocks/paymentMethods';
import { reactivationPlansResponse } from '@/mocks/reactivationPlans';
import { ReactivatePausedAccountCta } from './ReactivatePausedAccountCta';
import { pausedAccountMock } from './mocks';

const meta: Meta<typeof ReactivatePausedAccountCta> = {
  title: 'Components/ReactivatePausedAccountCta/ReactivatePausedAccountCta',
  component: ReactivatePausedAccountCta,
  parameters: {
    sessionProvider: true,
    msw: {
      handlers: [
        rest.get('/api/v5/payment_methods', (req, res, ctx) => {
          return res(ctx.json(paymentMethodsResponse));
        }),
        rest.get('/api/v5/account', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(pausedAccountMock));
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

type Story = StoryObj<typeof ReactivatePausedAccountCta>;

export const Default: Story = {};
