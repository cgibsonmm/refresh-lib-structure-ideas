import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AppConstants } from '@/context/AppConstants';
import { Card, Modal, Radio, RadioGroup, Stack, Text } from '@/theme/index';
// import { ApplePay } from './ApplePay/ApplePay';
// import { GooglePay } from './GooglePay/GooglePay';
import { PayPal } from './PayPal';
import { TokenEx } from './TokenEx';
// import { Venmo } from './Venmo/Venmo';

type PaymentMethodValue = 'genericCreditCard' | 'paypal';
// | 'applePay'
// | 'venmo'
// | 'googlePay';

interface PaymentMethod {
  label: string;
  component: JSX.Element;
  hide?: boolean;
}

/**
 * This component allows the user to add a new payment method to their account.
 * It includes the following payment methods: Credit or Debit card, PayPal, Apple Pay, Venmo, and Google Pay.
 */
export const RadioPaymentsModal = ({
  isOpen,
  onCloseHandle,
}: {
  /** If true, the modal is open. */
  isOpen: boolean;
  /** Calback fired when the modal is closed. */
  onCloseHandle: () => void;
}) => {
  const [, setApplePayHide] = useState<boolean>(true);
  const [, setVenmoHide] = useState<boolean>(true);
  const [, setGooglePayHide] = useState<boolean>(true);

  const paymentMethods = {
    genericCreditCard: {
      label: 'Credit or Debit card',
      component: <TokenEx onCloseModal={onCloseHandle} />,
    },
    paypal: {
      label: 'PayPal',
      component: <PayPal />,
    },
    // APMs are being disabled temporarily until the work in core is done. Currently we do not have the possibility of
    // Processing apm payments.
    // googlePay: {
    //   label: 'Google Pay',
    //   component: (
    //     <GooglePay
    //       setGooglePayHide={setGooglePayHide}
    //       onCloseModal={onCloseHandle}
    //     />
    //   ),
    //   hide: googlePayHide,
    // },
    // applePay: {
    //   label: 'Apple Pay',
    //   component: (
    //     <ApplePay
    //       setApplePayHide={setApplePayHide}
    //       onCloseModal={onCloseHandle}
    //     />
    //   ),
    //   hide: applePayHide,
    // },
    // venmo: {
    //   label: 'Venmo',
    //   component: (
    //     <Venmo venmoHide={setVenmoHide} onCloseModal={onCloseHandle} />
    //   ),
    //   hide: venmoHide,
    // },
  };

  return (
    <Modal
      open={isOpen}
      onClose={(_, reason?) => {
        reason || onCloseHandle();
      }}
      title={'Add new payment information'}
      hasCloseIcon
    >
      <PaymentMethods
        paymentMethods={paymentMethods}
        setApplePayHide={setApplePayHide}
        setVenmoHide={setVenmoHide}
        setGooglePayHide={setGooglePayHide}
      />
    </Modal>
  );
};

const PaymentMethods = ({
  paymentMethods,
  setApplePayHide,
  setVenmoHide,
  setGooglePayHide,
}: {
  paymentMethods: Record<PaymentMethodValue, PaymentMethod>;
  setApplePayHide: Dispatch<SetStateAction<boolean>>;
  setVenmoHide: Dispatch<SetStateAction<boolean>>;
  setGooglePayHide: Dispatch<SetStateAction<boolean>>;
}) => {
  //When the component get unmmounted, hide apms.
  useEffect(() => {
    return () => {
      setApplePayHide(true);
      setVenmoHide(true);
      setGooglePayHide(true);
    };
  }, []);

  const [selectedPayment, setSelectedPayment] = useState<string>('');

  const context = useContext(AppConstants);

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSelectedPayment((event.target as HTMLInputElement).value);
  };

  return (
    <Stack>
      <RadioGroup onChange={handleRadioChange}>
        {Object.entries(paymentMethods).map(([value, { label }]) => (
          <Card
            key={value}
            sx={{ marginBottom: 0.5, padding: 0 }}
            variant="outlined"
            style={{
              display: paymentMethods[value as PaymentMethodValue]?.hide
                ? 'none'
                : 'block',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              gap={4}
              padding={1}
              sx={(theme) => ({
                backgroundColor:
                  selectedPayment === value
                    ? theme.palette.secondary.main
                    : 'transparent',
              })}
            >
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Radio value={value} />
                <Text>{label}</Text>
              </Stack>
              <Stack
                width={50}
                height={30}
                marginLeft={'auto'}
                marginRight={1}
                justifyContent="center"
              >
                <img src={context[value as PaymentMethodValue]} alt={value} />
              </Stack>
            </Stack>

            <Stack
              display={selectedPayment === value ? 'flex' : 'none'}
              padding={1}
            >
              {paymentMethods[value as PaymentMethodValue].component}
            </Stack>
          </Card>
        ))}
      </RadioGroup>
    </Stack>
  );
};
