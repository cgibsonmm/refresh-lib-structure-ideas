import { reactivationPlansResponse } from '@/mocks/reactivationPlans';
import { EditPlan } from './EditPlan';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof EditPlan> = {
  title: 'Features/Reactivation/EditPlan',
  component: EditPlan,
  argTypes: {
    handleSelectedPlan: {
      action: 'handleSelectedPlan',
    },
    toggleEditPlan: {
      action: 'toggleEditPlan',
    },
    handleCancelClick: {
      action: 'handleCancelClick',
    },
  },
  args: {
    plans: reactivationPlansResponse.subscription.reactivation_limited_options,
    selectedPlan:
      reactivationPlansResponse.subscription.reactivation_limited_options[0],
  },
};

export default meta;

type Story = StoryObj<typeof EditPlan>;

export const Default: Story = {};
