import { useContext } from 'react';
import { AppConstants } from '@/context/AppConstants';
import { Box, Button, Modal, styled, Text } from '@/theme/index';

const ImageContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  margin: 0 auto;

  .success-image {
    max-height: 80px;
    max-width: 80px;
    object-fit: contain;
  }
`;

export interface UpgradeSuccessModalProps {
  /** If true, the modal is open */
  open: boolean;
  /** Callback fired when the user dismisses the modal by clicking on the **View Dashboard** button. */
  onAccept: () => void;
  /** Callback fired when the user tries to close the modal by either clicking on the backdrop or pressing the escape key. */
  onClose?: () => void;
}

/**
 * This component is a generic modal used to display a success message after the user upgrades their plan.
 * It allows the user to go to the dashboard.
 */
export const UpgradeSuccessModal = ({
  open,
  onAccept,
  onClose,
}: UpgradeSuccessModalProps) => {
  const { imgSuccessfulUpgrade } = useContext(AppConstants);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="upgrade-success-title"
    >
      <Box sx={{ textAlign: 'center' }}>
        <ImageContainer>
          <img
            src={imgSuccessfulUpgrade}
            className="success-image"
            alt="Success"
          />
        </ImageContainer>

        <Text
          id="upgrade-success-title"
          variant="h1"
          color="primary"
          sx={{
            fontSize: (theme) => theme.typography.fontSize * 2.5,
            marginY: 2,
          }}
        >
          Success! Your subscription is now active
        </Text>

        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={onAccept}
        >
          View Dashboard
        </Button>
      </Box>
    </Modal>
  );
};
