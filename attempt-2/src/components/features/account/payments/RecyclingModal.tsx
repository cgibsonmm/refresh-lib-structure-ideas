import { useContext, useEffect, useState } from 'react';
import { useSession } from '@/auth/index';
import { AppConstants } from '@/context/AppConstants';
import { Button, Modal, Stack, Text } from '@/theme/index';

interface RecyclingModalProps {
  /** If true, the modal is open. */
  open: boolean;
  /**
   * Callback fired when the user tries to close the modal by either
   * clicking on the close button, on the backdrop, on the **Not now** button,
   * or by pressing the escape key.
   */
  onClose: () => void;
  /** Callback fired when the user clicks on the **Update payment info now** button. */
  openUpdatePayment: () => void;
}

export const RecyclingModal = ({
  open,
  onClose,
  openUpdatePayment,
}: RecyclingModalProps) => {
  const [recyclingReportsRemaining, setRecyclingReportsRemaining] =
    useState(false);
  const {
    session: { account, userHasRecyclingReportsRemaining },
  } = useSession();
  useEffect(() => {
    setRecyclingReportsRemaining(!!userHasRecyclingReportsRemaining);
  }, [account]);

  const { paymentRequired, brandName } = useContext(AppConstants);
  return (
    <Modal hasCloseIcon open={open} onClose={onClose}>
      <Stack
        direction="column"
        alignItems="center"
        textAlign="center"
        gap={1.25}
        maxWidth={300}
      >
        <img src={paymentRequired} alt="Payment Required" />
        <Text variant="h2">Payment Update Required</Text>
        <Text variant="subtitle2">
          {recyclingReportsRemaining
            ? `We were unable to bill your account, but we have left it active as a courtesy. Please update your payment method on file to continue accessing ${brandName}`
            : `We were unable to bill your account. Please update your payment method on file to continue accessing ${brandName}`}
        </Text>
        <Button variant="contained" color="primary" onClick={openUpdatePayment}>
          Update payment info now
        </Button>
        <Text
          variant="h6"
          color="primary"
          sx={{ cursor: 'pointer' }}
          onClick={onClose}
        >
          Not now
        </Text>
      </Stack>
    </Modal>
  );
};
