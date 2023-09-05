import { StoryObj, Meta } from '@storybook/react';
import { UpgradeFailureModal } from './UpgradeFailureModal';

const meta: Meta<typeof UpgradeFailureModal> = {
  title: 'Components/UpgradePlan/UpgradeFailureModal',
  component: UpgradeFailureModal,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
  },
  argTypes: {
    onClose: { action: 'close' },
    onTryAgain: { action: 'try again' },
    onChangeCard: { action: 'change card' },
  },
  args: {
    open: true,
    errors: [
      'Unfortunately, the card your are using was declined due to insufficient funds. You can try using a different card or pay with PayPal. If you are still unable to complete this payment, please call your bank or the phone number on the back of your card.',
    ],
  },
};

export default meta;

type Story = StoryObj<typeof UpgradeFailureModal>;

export const Default: Story = {};

export const MultipleErrors: Story = {
  args: {
    errors: ['Insufficient funds', 'Card expired', 'Card declined'],
  },
};

export const NoErrors: Story = {
  args: {
    errors: [],
  },
};

export const NoErrorsWithDefaultMessage: Story = {
  args: {
    errors: [],
    defaultErrorMessage: "💣 Couldn't process your payment. Please try again.",
  },
};
