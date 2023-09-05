import { reactivationPlansResponse } from '@/mocks/reactivationPlans';
import { EditPlanCard } from './EditPlanCard';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof EditPlanCard> = {
  title: 'Features/Reactivation/EditPlanCard',
  component: EditPlanCard,
  argTypes: {
    handleSelectedPlan: { action: 'handleSelectedPlan' },
  },
  args: {
    plan: reactivationPlansResponse.subscription
      .reactivation_limited_options[0],
    selectedPlan:
      reactivationPlansResponse.subscription.reactivation_limited_options[0],
  },
};

export default meta;

type Story = StoryObj<typeof EditPlanCard>;

export const Default: Story = {};
