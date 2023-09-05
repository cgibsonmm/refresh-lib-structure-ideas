import { ContactOptionsModal } from './ContactOptionsModal';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ContactOptionsModal> = {
  title: 'Components/ContactOptionsModal',
  component: ContactOptionsModal,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 600,
      },
    },
  },
  argTypes: {
    setIsOpen: { action: 'setIsOpen' },
    onCloseHandle: { action: 'onCloseHandle' },
    openConfirmCancelModal: { action: 'openConfirmCancelModal' },
  },
  args: {
    isOpen: true,
  },
};

export default meta;

type Story = StoryObj<typeof ContactOptionsModal>;

export const Default: Story = {};
