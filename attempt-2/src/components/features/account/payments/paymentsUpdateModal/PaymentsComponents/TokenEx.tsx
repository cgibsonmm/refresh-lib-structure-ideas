import { SelectChangeEvent, InputLabel, useTheme } from '@mui/material';
import { RefObject, useContext, useEffect, useRef, useState } from 'react';
import { DeepMap, FieldError, useForm, UseFormRegister } from 'react-hook-form';
import { useCreateCard } from '@/account/creditCardService';
import { AppConfig } from '@/context/AppConfig';
import {
  Alert,
  Button,
  FormControl,
  Input,
  Select,
  Snackbar,
  Stack,
  Text,
} from '@/theme/components';
import {
  exesForType,
  inputLabelStyles,
  isExpirationDateValid,
  months,
  years,
} from './constants';
import {
  useGetTokenExIframeSrc,
  messageHandler,
} from '../TokenExService/TokenExService';
import { ValidateHandlerEvent, FormData } from '../TokenExService/constants';

export const TokenEx = ({ onCloseModal }: { onCloseModal: () => void }) => {
  const { data: Iframe, isLoading, isError } = useGetTokenExIframeSrc();
  const useCreateCreditDebitCard = useCreateCard();
  const {
    handleSubmit,
    register,
    formState: { errors, isDirty },
    watch,
    trigger,
    setValue,
  } = useForm<FormData>({ mode: 'onChange' });

  const { logError } = useContext(AppConfig);
  const [iframeExpired, setIframeExpired] = useState<boolean>(false);
  const [iframeInputInvalid, setIframeInputInvalid] = useState<boolean>(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [iframeIsLoaded, setIframeIsLoaded] = useState<boolean>(false);
  const tokenExLabelRef = useRef<HTMLLabelElement>(null);

  const onSubmit = (
    formData: FormData,
    token: string,
    maskedNumber: string
  ) => {
    if (iframeExpired) return;

    const creditCardData = Object.assign(
      {},
      ...Object.entries(formData).map(([key, value]) => {
        return { [`credit_card[${key}]`]: value };
      })
    );
    creditCardData['credit_card[card_number]'] = maskedNumber;
    creditCardData['credit_card[tokenex_token]'] = token;
    useCreateCreditDebitCard.mutate(new URLSearchParams(creditCardData), {
      onSuccess: () => {
        setShowSuccessAlert(true);
        setTimeout(() => {
          onCloseModal();
        }, 1000);
      },
      onError: () => setShowErrorAlert(true),
    });
  };

  //Initialize tokenEx Iframe.
  useEffect(() => {
    if (!isLoading && !isError) {
      Iframe?.load?.();
    }
    return () => {
      Iframe?.remove?.();
    };
  }, [Iframe, isLoading, isError]);

  //TokenEx message event handlers.
  const eventHandlers = {
    loadHandler() {
      setIframeIsLoaded(true);
    },
    onIframeExpired() {
      setIframeExpired(true);
    },
    validateHandler(event: ValidateHandlerEvent) {
      const inputHasValue = event.data.validator !== 'required';
      setIframeInputInvalid(!event.data.isValid);
      tokenExLabelRef.current?.classList.toggle('has-value', inputHasValue);
    },
    onIFrameLoadError(error: Error) {
      logError('Error loading tokenEx iframe.', error);
    },
    tokenizeHandler(
      event: MessageEvent<{
        firstSix: string;
        lastFour: string;
        referenceNumber: string;
        token: string;
        tokenHMAC: string;
        cardType: string;
      }>
    ) {
      const data = event.data;
      if (
        !(
          data.firstSix &&
          data.lastFour &&
          data.referenceNumber &&
          data.token &&
          data.tokenHMAC
        )
      ) {
        return;
      }

      const token = data.token;
      const maskedNumber =
        data.firstSix + exesForType(data.cardType) + data.lastFour;

      handleSubmit((formData) => onSubmit(formData, token, maskedNumber))();
    },
    blurHandler() {
      const labelElement = tokenExLabelRef.current;
      if (labelElement?.classList.contains('has-value')) return;
      labelElement?.classList?.remove('focused');
    },
    focusHandler() {
      tokenExLabelRef.current?.classList?.add('focused');
    },
  };

  const reference = (event: MessageEvent) => {
    messageHandler(event, eventHandlers, logError);
  };

  //Tokenex listener for message events.
  useEffect(() => {
    window.addEventListener('message', reference);
    return () => {
      window.removeEventListener('message', reference);
    };
  }, [eventHandlers]);

  const validateExpirationDate = () => {
    const selectedMonth = parseInt(watch('expiration_month'));
    const selectedYear = parseInt(watch('expiration_year'));
    const isValidDate = isExpirationDateValid(selectedMonth, selectedYear);
    return isValidDate ? true : 'Please enter a valid expiration date.';
  };
  const handleTriggerSelectsValidation = (
    event: SelectChangeEvent<unknown>
  ) => {
    setValue(event.target.name as keyof FormData, event.target.value as string);
    trigger(['expiration_month', 'expiration_year']);
  };

  const handleTokenization = () => {
    trigger();
    Iframe?.tokenize?.();
  };

  return (
    <>
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
            Your card has been added successfully.
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
            Failed to add card.
          </Alert>
        </Snackbar>
      )}

      <Stack gap={1} justifyContent="center" alignItems="center" maxWidth={300}>
        <NameInputs register={register} errors={errors} />
        <CardNumberInput
          tokenExLabelRef={tokenExLabelRef}
          iframeInputInvalid={iframeInputInvalid}
          iframeIsLoaded={iframeIsLoaded}
        />
        <ExpirationInputs
          register={register}
          errors={errors}
          handleTriggerSelectsValidation={handleTriggerSelectsValidation}
          validateExpirationDate={validateExpirationDate}
        />
        <PostalCodeAndCvvInput register={register} errors={errors} />
        <Button
          variant="contained"
          fullWidth
          disabled={!isDirty || Object.keys(errors).length !== 0}
          onClick={handleTokenization}
        >
          Add card
        </Button>
      </Stack>
    </>
  );
};
const NameInputs = ({
  register,
  errors,
}: {
  register: UseFormRegister<FormData>;
  errors: DeepMap<Record<string, unknown>, FieldError>;
}) => {
  return (
    <Stack direction="row" gap={0.25}>
      <Input
        variant="outlined"
        sx={{ maxWidth: '150px' }}
        label="First name"
        {...register('first_name', { required: true })}
        error={Boolean(errors.first_name)}
        helperText={errors.first_name && 'Please enter your first name.'}
        FormHelperTextProps={{ style: { fontSize: '10px', margin: 0 } }}
        inputProps={{ tabIndex: 1 }}
      />
      <Input
        variant="outlined"
        sx={{ maxWidth: '150px' }}
        label="Last name"
        {...register('last_name', { required: true })}
        error={Boolean(errors.last_name)}
        helperText={errors.last_name && 'Please enter your last name.'}
        FormHelperTextProps={{ style: { fontSize: '10px', margin: 0 } }}
        inputProps={{ tabIndex: 2 }}
      />
    </Stack>
  );
};
const ExpirationInputs = ({
  register,
  errors,
  handleTriggerSelectsValidation,
  validateExpirationDate,
}: {
  register: UseFormRegister<FormData>;
  errors: DeepMap<Record<string, unknown>, FieldError>;
  handleTriggerSelectsValidation: (event: SelectChangeEvent<unknown>) => void;
  validateExpirationDate: () => boolean | string;
}) => {
  return (
    <Stack width={'100%'}>
      <Stack direction="row" gap={1} width={'100%'}>
        <FormControl fullWidth>
          <InputLabel
            error={Boolean(errors.expiration_month)}
            id="helper-label-exp-month"
          >
            Exp.Month
          </InputLabel>
          <Select
            labelId="helper-label-exp-month"
            label="Exp.Month"
            id={'expiration-months'}
            defaultValue={months[0].value}
            options={months}
            {...register('expiration_month', {
              required: true,
              validate: validateExpirationDate,
            })}
            onChange={handleTriggerSelectsValidation}
            error={Boolean(errors.expiration_month)}
            inputProps={{ tabIndex: 4 }}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel
            error={Boolean(errors.expiration_year)}
            id="helper-label-exp-year"
          >
            Exp.Year
          </InputLabel>
          <Select
            labelId="helper-label-exp-year"
            label="Exp.Year"
            id={'expiration-years'}
            defaultValue={years[0].value}
            options={years}
            {...register('expiration_year', {
              required: true,
              validate: validateExpirationDate,
            })}
            onChange={handleTriggerSelectsValidation}
            error={Boolean(errors.expiration_year)}
            inputProps={{ tabIndex: 5 }}
          />
        </FormControl>
      </Stack>
      {errors.expiration_year && errors.expiration_month && (
        <Text variant="caption" color={(theme) => theme.palette.error.main}>
          {errors.expiration_year.message}
        </Text>
      )}
    </Stack>
  );
};
const PostalCodeAndCvvInput = ({
  register,
  errors,
}: {
  register: UseFormRegister<FormData>;
  errors: DeepMap<Record<string, unknown>, FieldError>;
}) => {
  return (
    <Stack direction="row" gap={1}>
      <Input
        sx={{ width: '50%' }}
        type="tel"
        inputProps={{ maxLength: 5, minLength: 5, tabIndex: 6 }}
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
      <Input
        sx={{ width: '50%' }}
        variant="outlined"
        label="CVV"
        inputProps={{ maxLength: 4, tabIndex: 7 }}
        {...register('verification_number', {
          required: true,
          minLength: 3,
          maxLength: 4,
          pattern: /^\d+$/,
        })}
        helperText={
          errors.verification_number &&
          'Please enter a valid verification number.'
        }
        FormHelperTextProps={{ style: { margin: 0 } }}
        error={Boolean(errors.verification_number)}
      />
    </Stack>
  );
};
const CardNumberInput = ({
  tokenExLabelRef,
  iframeInputInvalid,
  iframeIsLoaded,
}: {
  tokenExLabelRef: RefObject<HTMLLabelElement>;
  iframeInputInvalid: boolean;
  iframeIsLoaded: boolean;
}) => {
  const theme = useTheme();
  return (
    <Stack width={'100%'} position={'relative'} marginBottom={1}>
      <div
        id="tokenex-iframe-target"
        className="ltv-div__field"
        style={{
          height: '46px',
          margin: '8px 0 0 0',
          border: !iframeIsLoaded ? '1px solid #d6d6d6' : 'none',
          borderRadius: !iframeIsLoaded ? '4px' : 0,
        }}
      >
        <InputLabel
          ref={tokenExLabelRef}
          sx={inputLabelStyles}
          style={{
            color: iframeInputInvalid ? theme.palette.error.main : '#999',
          }}
        >
          Card number
        </InputLabel>
      </div>
      {iframeInputInvalid && (
        <Text variant="caption" color={(theme) => theme.palette.error.main}>
          Please enter a valid credit or debit card number.
        </Text>
      )}
    </Stack>
  );
};
