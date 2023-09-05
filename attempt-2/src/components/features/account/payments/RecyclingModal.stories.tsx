import { Meta, StoryObj } from '@storybook/react';
import { RecyclingModal } from './RecyclingModal';

const meta: Meta<typeof RecyclingModal> = {
  title: 'Features/Payments/RecyclingModal',
  component: RecyclingModal,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
  },
  argTypes: {
    openUpdatePayment: { action: 'openUpdatePayment' },
    onClose: { action: 'onClose' },
  },
  args: {
    open: true,
  },
};

export default meta;

type Story = StoryObj<typeof RecyclingModal>;

export const Default: Story = {};
