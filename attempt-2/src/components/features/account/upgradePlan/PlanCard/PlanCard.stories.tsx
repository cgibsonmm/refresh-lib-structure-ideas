import { StoryObj, Meta } from '@storybook/react';
import { PlanCard } from './PlanCard';

const meta: Meta<typeof PlanCard> = {
  title: 'Components/UpgradePlan/PlanCard',
  component: PlanCard,
  argTypes: {
    onClick: { action: 'onClick' },
  },
  args: {
    heading: 'Starter',
    limit: 100,
    cost: 29.99,
    renewalPeriod: 1,
  },
};

export default meta;

type Story = StoryObj<typeof PlanCard>;

export const Default: Story = {};

export const SubHeading: Story = {
  args: {
    subheading: 'Starting small and simple',
  },
};

// Hover card variant was disabled due to an issue with Safari, even though the flag can be passed in it has no effect
// export const HoverCard: Story: Story = {
//   args: {
//     hoverCard: true,
//   },
// };

export const CostPerReport: Story = {
  args: {
    costPerReport: 0.3,
  },
};

export const MostPopular: Story = {
  args: {
    mostPopular: true,
  },
};

export const Savings: Story = {
  args: {
    savings: 15,
    costPerReport: 0.3,
  },
};

export const Unlimited: Story = {
  args: {
    limit: -1,
  },
};

export const MultiMonth: Story = {
  args: {
    renewalPeriod: 3,
  },
};

export const Annual: Story = {
  args: {
    renewalPeriod: 12,
  },
};
