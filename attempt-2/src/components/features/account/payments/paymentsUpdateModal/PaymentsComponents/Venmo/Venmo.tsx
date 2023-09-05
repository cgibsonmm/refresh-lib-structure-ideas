import { Dispatch, SetStateAction, useContext, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateBraintreePaymentMethod } from '@/account/braintreeService';
import { useSnackbar } from '@/alerts/index';
import { AppConfig } from '@/context/AppConfig';
import { AppConstants } from '@/context/AppConstants';
import { Button, Input, Stack } from '@/theme/components';
import { useBraintreeGatewayService } from '../../BraintreeServices/BraintreeGatewayService';

export const Venmo = ({
  venmoHide,
  onCloseModal,
}: {
  venmoHide: Dispatch<SetStateAction<boolean>>;
  onCloseModal: () => void;
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { logError } = useContext(AppConfig);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const regex = /^\d*\.?\d*$/;

  const {
    getValues,
    register,
    trigger,
    formState: { errors },
  } = useForm<{ postal_code: string }>({ mode: 'onChange' });

  const addVenmoQuery = useCreateBraintreePaymentMethod();

  const submitHandler = ({ event }: { event: Event }) => {
    event.preventDefault();

    if (braintreeGatewayResponse.isTokenExpired.current) {
      enqueueSnackbar(
        'Your session has expired. For your security, please refresh the page to restart your session.',
        { variant: 'error' }
      );
      return;
    }

    trigger('postal_code');
    const { postal_code } = getValues();

    if (!regex.test(postal_code) || postal_code.length < 5) {
      return;
    }

    submitPayment(postal_code).then(() => {
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
      }
    });
  };

  const submitPayment = async (postal_code: string) => {
    return braintreeGatewayResponse.paymentInstance.current
      .tokenize()
      .then((payload: { nonce: string }) => process(payload, postal_code))
      .catch((error: unknown) =>
        logError('Error while Venmo tokenize the payment', error as Error)
      );
  };

  const process = (payload: { nonce: string }, postal_code: string) => {
    addVenmoQuery.mutate(
      { nonce: payload.nonce, postalCode: postal_code },
      {
        onSuccess: () => {
          enqueueSnackbar('Venmo account added successfully', {
            variant: 'success',
            autoHideDuration: 6000,
          });
          onCloseModal();
        },
        onError: () => {
          enqueueSnackbar(
            'An error occurred while adding Venmo account. Please contact support for assistance.',
            {
              variant: 'success',
              autoHideDuration: 6000,
            }
          );
          onCloseModal();
        },
      }
    );
  };

  const paymentType = 'venmo';

  const clientCreationErrorHandler = (error: Error) => {
    logError('Error Creating Venmo Braintree Client', error);
  };

  const paymentInstanceCreatedHandler = (paymentMethodSupported?: boolean) => {
    if (!paymentMethodSupported) return;
    venmoHide(false);
  };

  const setPaymentMethodSupport = async () => {
    return braintreeGatewayResponse.paymentInstance.current.isBrowserSupported();
  };

  const configObject = {
    clientCreationErrorHandler,
    paymentInstanceCreatedHandler,
    submitter: buttonRef.current,
    submitHandler,
    setPaymentMethodSupport,
  };

  const braintreeGatewayResponse = useBraintreeGatewayService(
    paymentType,
    configObject
  );

  useEffect(() => {
    if (!braintreeGatewayResponse.isReadyForGateway) return;
    braintreeGatewayResponse.initializePaymentGateway();
  }, [braintreeGatewayResponse.isReadyForGateway]);

  const context = useContext(AppConstants);
  return (
    <Stack width="100%" justifyContent="center" alignItems="center">
      <Input
        sx={{ width: '50%', marginBottom: '10px' }}
        type="tel"
        inputProps={{ maxLength: 5, minLength: 5 }}
        variant="outlined"
        fullWidth
        label="Postal Code"
        {...register('postal_code', {
          required: true,
          maxLength: 5,
          minLength: 5,
          pattern: /^\d*\.?\d*$/,
        })}
        helperText={errors.postal_code && 'Invalid postal code.'}
        FormHelperTextProps={{ style: { margin: 0 } }}
        error={Boolean(errors.postal_code)}
      />
      <Button
        id="venmo-template"
        className="venmo-submitter"
        sx={{ padding: 0, maxWidth: '280px', height: '48px' }}
        ref={buttonRef}
      >
        <img src={context.venmoButton} alt="venmoButton" width="100%" />
      </Button>
    </Stack>
  );
};
