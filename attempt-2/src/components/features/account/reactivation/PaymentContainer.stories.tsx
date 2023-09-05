import { reactivationPlansResponse } from '@/mocks/reactivationPlans';
import { PaymentContainer } from './PaymentContainer';
import { PaymentMethods } from '../Interfaces';
import type { StoryObj, Meta } from '@storybook/react';

const meta: Meta<typeof PaymentContainer> = {
  title: 'Features/Reactivation/PaymentContainer',
  component: PaymentContainer,
  argTypes: {
    toggleEditPlan: { action: 'toggleEditPlan' },
    toggleEditPayment: { action: 'toggleEditPayment' },
  },
  args: {
    paymentMethod: [
      {
        card_type: 'master',
        last_four: '3456',
      } as PaymentMethods,
    ],
    selectedPlan:
      reactivationPlansResponse.subscription.reactivation_limited_options[0],
  },
};

export default meta;

export const Default: StoryObj<typeof PaymentContainer> = {};

export const Loading: StoryObj<typeof PaymentContainer> = {
  args: {
    paymentMethod: undefined,
  },
};
