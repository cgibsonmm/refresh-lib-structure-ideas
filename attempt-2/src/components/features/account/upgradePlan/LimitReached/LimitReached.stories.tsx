import { StoryObj, Meta } from '@storybook/react';
import { LimitReached } from './LimitReached';

const meta: Meta<typeof LimitReached> = {
  title: 'Components/UpgradePlan/LimitReached',
  component: LimitReached,
  argTypes: {
    onContactUs: { action: 'contact us' },
  },
};

export default meta;

type Story = StoryObj<typeof LimitReached>;

export const Default: Story = {};
