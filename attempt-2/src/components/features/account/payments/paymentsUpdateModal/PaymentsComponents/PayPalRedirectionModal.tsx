import React, { useContext, useState } from 'react';
import { useCreatePaypalAgreement } from '@/account/paypalService';
import { AppConfig } from '@/context/AppConfig';
import { AppConstants } from '@/context/AppConstants';
import {
  Alert,
  Button,
  CircularProgress,
  Modal,
  Snackbar,
  Stack,
  Text,
} from '@/theme/components';

export const PayPalRedirectionModal = ({
  isOpen,
  onCloseHandle,
  paypalState,
}: {
  /** If true, the modal is open */
  isOpen: boolean;
  onCloseHandle: () => void;
  paypalState: 'canceled' | 'success';
}) => {
  const title = {
    success: 'Payment Method Added',
    canceled: 'PayPal Transaction Cancelled',
  };
  return (
    <Modal title={title[paypalState]} open={isOpen}>
      {paypalState === 'success' && (
        <PayPalSuccessRedirectionContent onClose={onCloseHandle} />
      )}
      {paypalState === 'canceled' && (
        <PayPalCanceledRedirectionContent onClose={onCloseHandle} />
      )}
    </Modal>
  );
};

const PayPalSuccessRedirectionContent = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const paypalAgreementQuery = useCreatePaypalAgreement();
  const { navigate } = useContext(AppConfig).routingUtils;
  const context = useContext(AppConstants);

  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [disabledButton, setDisabledButton] = useState<boolean>(false);

  const handleAddPayPalAgreement = () => {
    setIsProcessing(true);
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const sourceURL = urlParams.get('source');

    if (!token || !sourceURL) return;
    const formData = new URLSearchParams();
    formData.set('paypal_token', token);

    const rawURL = window.atob(sourceURL);
    paypalAgreementQuery.mutate(formData, {
      onSuccess: () => {
        setShowSuccessAlert(true);
        setTimeout(() => {
          navigate(rawURL);
          onClose();
        }, 3000);
      },
      onError: () => {
        setShowErrorAlert(true);
        setDisabledButton(true);
        setIsProcessing(false);
        setTimeout(() => {
          navigate(rawURL);
          onClose();
        }, 3000);
      },
    });
  };

  return (
    <Stack width="100%" alignItems="center" justifyContent="center">
      {showSuccessAlert && (
        <Snackbar
          open={showSuccessAlert}
          autoHideDuration={3000}
          onClose={() => setShowSuccessAlert(false)}
        >
          <Alert
            onClose={() => setShowSuccessAlert(false)}
            severity="success"
            variant="filled"
          >
            Your paypal agreement has been added successfully.
          </Alert>
        </Snackbar>
      )}
      {showErrorAlert && (
        <Snackbar
          open={showErrorAlert}
          autoHideDuration={5000}
          onClose={() => setShowErrorAlert(false)}
        >
          <Alert
            onClose={() => setShowErrorAlert(false)}
            severity="error"
            variant="filled"
          >
            Failed to add the paypal agreement.
          </Alert>
        </Snackbar>
      )}

      <Stack alignItems="center" width={200} gap={1}>
        <img src={context.paypal} alt="paypal_img" />
        <Text align="center">
          Your PayPal account is about to be setup as the default payment
          method.
        </Text>

        {isProcessing && (
          <Stack
            padding={4}
            gap={1}
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress
              variant="indeterminate"
              size={50}
              disableShrink
              sx={{
                color: (theme) => theme.palette.primary.main,
                position: 'absolute',
                animationDuration: '550ms',
                zIndex: 1,
              }}
              thickness={2}
            />
            <CircularProgress
              variant="determinate"
              sx={{
                color: (theme) => theme.palette.secondary.main,
                position: 'absolute',
              }}
              size={50}
              thickness={2}
              value={100}
            />
          </Stack>
        )}

        {!isProcessing && (
          <Button
            disabled={disabledButton}
            variant="contained"
            onClick={handleAddPayPalAgreement}
          >
            Accept
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

const PayPalCanceledRedirectionContent = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const { navigate } = useContext(AppConfig).routingUtils;
  const context = useContext(AppConstants);

  const handleAddPayPalAgreement = () => {
    const urlParams = new URLSearchParams(location.search);
    const sourceURL = urlParams.get('source');

    if (!sourceURL) return;

    const rawURL = window.atob(sourceURL);
    navigate(rawURL);
    onClose();
  };

  return (
    <Stack width="100%" alignItems="center" justifyContent="center">
      <Stack alignItems="center" width={200} gap={1}>
        <img src={context.paypal} alt="paypal_img" />
        <Text align="center">
          You selected to cancel the PayPal transaction. No changes have been
          done to your payment methods.
        </Text>
        <Button variant="contained" onClick={handleAddPayPalAgreement}>
          Accept
        </Button>
      </Stack>
    </Stack>
  );
};
