import React, { useEffect, useState } from 'react';
import { Alert, CircularProgress, Snackbar, Stack } from '@/theme/components';
import { usePayPalService } from '../PayPalService/PayPalService';
import { PayPalEvent } from '../PayPalService/constants';

export const PayPal = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paypalError, setPaypalError] = useState<boolean>(false);

  const onBeforeProcessing = () => {
    setIsProcessing(true);
  };
  const onAfterProcessing = () => {
    setIsProcessing(false);
  };

  const onError = () => {
    setPaypalError(true);
  };

  const { initPayPal } = usePayPalService({
    onBeforeProcessing,
    onAfterProcessing,
    onError,
  });

  useEffect(() => {
    window.paypalCheckoutReady = () => {
      checkoutReady();
    };
  }, []);

  const checkoutReady = () => {
    window.paypal.checkout.setup('Merchant-ID', {
      click: (event: PayPalEvent) => {
        event.preventDefault();
        initPayPal();
      },
      container: 'paypal-target',
      size: 'medium',
      shape: 'rect',
    });
  };

  return (
    <Stack direction="row" justifyContent="center" width="100%">
      {paypalError && (
        <Snackbar
          open={paypalError}
          autoHideDuration={5000}
          onClose={() => setPaypalError(false)}
        >
          <Alert
            onClose={() => setPaypalError(false)}
            severity="error"
            variant="filled"
          >
            Failed to add card.
          </Alert>
        </Snackbar>
      )}

      {!isProcessing && <div id="paypal-target" />}
      {isProcessing && (
        <Stack padding={6} gap={1} alignItems="center" justifyContent="center">
          <CircularProgress
            variant="indeterminate"
            size={60}
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
            size={60}
            thickness={2}
            value={100}
          />
        </Stack>
      )}
    </Stack>
  );
};
