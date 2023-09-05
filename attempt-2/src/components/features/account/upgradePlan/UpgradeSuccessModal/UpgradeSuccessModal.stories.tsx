import { StoryObj, Meta } from '@storybook/react';
import { UpgradeSuccessModal } from './UpgradeSuccessModal';

const meta: Meta<typeof UpgradeSuccessModal> = {
  title: 'Components/UpgradePlan/UpgradeSuccessModal',
  component: UpgradeSuccessModal,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
  },
  argTypes: {
    onAccept: { action: 'onAccept' },
  },
  args: {
    open: true,
  },
};

export default meta;

type Story = StoryObj<typeof UpgradeSuccessModal>;

export const Default: Story = {};
