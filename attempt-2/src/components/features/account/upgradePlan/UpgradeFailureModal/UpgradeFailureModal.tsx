import { Box, Button, Modal, Text, styled } from '@/theme/index';

export const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export interface UpgradeFailureModalProps {
  /** If true, the modal is open. */
  open: boolean;
  /** Array of errors to show.*/
  errors: string[];
  /** Default error message to show if the errors array is empty. */
  defaultErrorMessage?: string;
  /**
   * Callback fired when the user tries to close the modal by either
   * clicking on the close button, on the backdrop or by pressing the escape key
   */
  onClose?: () => void;
  /** Callback fired when the user clicks on the **Try Again** button. */
  onTryAgain: () => void;
  /** Callback fired when the user clicks on the **Change Card** button. */
  onChangeCard: () => void;
}

/**
 * This component is a generic modal used to display errors when the user tries to upgrade their plan and there is
 * an error processing the payment.
 * It allows the user to try again or change the card, which main goal is to avoid the user having to go through the
 * whole upgrade flow again.
 */
export const UpgradeFailureModal = ({
  open,
  errors,
  defaultErrorMessage = 'Something went wrong. Please try again.',
  onClose,
  onTryAgain,
  onChangeCard,
}: UpgradeFailureModalProps) => {
  if (!errors.length) errors[0] = defaultErrorMessage;

  return (
    <Modal
      open={open}
      onClose={onClose}
      hasCloseIcon
      aria-labelledby="upgrade-failure-title"
    >
      <Text
        id="upgrade-failure-title"
        variant="h1"
        color="primary"
        sx={{
          fontSize: (theme) => theme.typography.fontSize * 2.5,
          marginY: 2,
        }}
      >
        Payment Failed
      </Text>

      <Text color="error">The payment had errors!</Text>

      <ul>
        {errors.map((error, index) => (
          <Text component="li" color="error" key={`error-${index}`}>
            {error}
          </Text>
        ))}
      </ul>

      <ButtonsContainer>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={onTryAgain}
        >
          Try Again
        </Button>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={onChangeCard}
        >
          Change Card
        </Button>
      </ButtonsContainer>
    </Modal>
  );
};
