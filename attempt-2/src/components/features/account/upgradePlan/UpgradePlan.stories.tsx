import { StoryObj, Meta } from '@storybook/react';
import { UpgradePlan } from './UpgradePlan';
import { currentPlanMock, plansMock } from './mocks';

const meta: Meta<typeof UpgradePlan> = {
  title: 'Components/UpgradePlan',
  component: UpgradePlan,
  argTypes: {
    onSelectPlan: { action: 'select plan' },
    onContactUs: { action: 'contact us' },
  },
  args: {
    currentPlan: currentPlanMock,
    plans: plansMock,
  },
};

export default meta;

type Story = StoryObj<typeof UpgradePlan>;

export const Default: Story = {};

export const Unlimited: Story = {
  args: {
    currentPlan: {
      title: 'Power User',
      limit: 'unlimited',
    },
  },
};

export const Cancelled: Story = {
  args: {
    currentPlan: {
      title: 'Power User',
      limit: 'unlimited',
      canceled: true,
    },
  },
};

export const NoPlans: Story = {
  args: {
    plans: [],
  },
};
