import React, { useContext, useEffect, useState } from 'react';
import { PaymentMethods } from '@/account/Interfaces';
import {
  useGetPaymentMethod,
  filterActivePaymentMethod,
} from '@/account/paymentMethodsService';
import { AppConstants } from '@/context/AppConstants';
import { Button, Checkbox, Link, Modal, Stack, Text } from '@/theme/index';
import { titleize } from '@/utils/index';

export interface TosModalProps {
  /** If true, the modal is open. */
  open: boolean;
  /** Specify if the checkbox should be shown. */
  showCheckbox: boolean;
  /** The billing frequency associated to the payment. */
  billingFrecuency:
    | 'a one time'
    | 'every 3 months'
    | 'every month'
    | (string & Record<never, never>);
  /** The price to be billed. */
  billedPrice: number | string;
  /** Specifies if payment method details should be shown. */
  showPaymentMethod?: boolean;
  /** Custom text for the CTA button. */
  cta?: {
    /** The text to be displayed in the CTA button. */
    text?: string;
    /** Specifies if the CTA button should be extra wide in the `sm` breakpoint. */
    extraWide?: boolean;
  };
  /** Callback fired when the user tries to close the modal by either clicking on the backdrop or pressing the escape key */
  onClose: () => void;
  /** Callback fired when the user clicks the accepts the terms of service */
  acceptTos: () => void;
  /** Callback fired when the user requests to change the payment method */
  onChangePaymentMethod?: () => void;
}

const defaultCta = {
  text: 'Accept',
  extraWide: false,
};

/**
 * This component is a generic modal used to display the terms of service for the user to accept
 * before a payment is processed.
 */
export const TosModal = ({
  open,
  showCheckbox,
  billingFrecuency,
  billedPrice,
  showPaymentMethod = false,
  cta = defaultCta,
  onClose,
  acceptTos,
  onChangePaymentMethod,
}: TosModalProps) => {
  const [tos1, setTos1] = useState<boolean>(false);
  const [tos2, setTos2] = useState<boolean>(false);
  const [disabledButton, setDisabledButton] = useState<boolean>(true);
  const [paymentTypeMessage, setPaymentTypeMessage] = useState<string>('');

  useEffect(() => {
    if (!showCheckbox) {
      setDisabledButton(false);
      return;
    }
    const disabled = !(tos1 && tos2);
    setDisabledButton(disabled);
  }, [tos1, tos2]);

  if (showPaymentMethod) {
    const paymentMethodQuery = useGetPaymentMethod();
    const [activePayment, setActivePayment] = useState<PaymentMethods>();

    useEffect(() => {
      if (!paymentMethodQuery.isLoading && !paymentMethodQuery.isError) {
        setActivePayment(filterActivePaymentMethod(paymentMethodQuery?.data));
      }
    }, [paymentMethodQuery]);

    useEffect(() => {
      if (activePayment) {
        if (activePayment.email) {
          setPaymentTypeMessage(
            `Your PayPal with email ${activePayment.email} will be charged.`
          );
        } else if (activePayment.card_type && activePayment.last_four) {
          setPaymentTypeMessage(
            `Your ${titleize(activePayment.card_type)} ending in - ${
              activePayment.last_four
            } will be charged.`
          );
        }
      }
    }, [activePayment]);
  }

  const context = useContext(AppConstants);
  return (
    <Modal
      open={open}
      onClose={() => {
        setTos1(false);
        setTos2(false);
        onClose();
      }}
    >
      <Stack gap={2.5} alignItems="center">
        <Stack direction="column" alignItems="center" gap={0.5}>
          <Text align="center" margin={0} variant="h3">
            One last step!
          </Text>
          <Text align="center" margin={0} variant="h5">
            Review & accept the agreement below
          </Text>
        </Stack>
        <Stack gap={1.5}>
          <Stack direction="row">
            {showCheckbox && (
              <Checkbox
                onChange={(e) => {
                  setTos1(e.target.checked);
                }}
                sx={(theme) => ({
                  padding: 1,
                  height: theme.spacing(4),
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                })}
              />
            )}
            <Text variant="body1">
              By clicking the {showCheckbox ? 'checkbox' : '“Accept” button'}, I
              represent that I am over 18 years of age and I agree to the{' '}
              {
                <Link
                  variant="h5"
                  href={context.tosLink}
                  target="_blank"
                  rel="noopener"
                >
                  Terms of Service
                </Link>
              }{' '}
              and{' '}
              {
                <Link
                  variant="h5"
                  href={context.privacyLink}
                  target="_blank"
                  rel="noopener"
                >
                  Privacy Policy
                </Link>
              }
              , and I agree to receive email from{' '}
              <Link
                variant="h5"
                href={context.brandLink}
                target="_blank"
                rel="noopener"
              >
                {context.brandName}.com
              </Link>
              . I agree to be billed {billedPrice} plus applicable sales tax{' '}
              {billingFrecuency}
              {billingFrecuency === 'a one time'
                ? ''
                : ' until this subscription is canceled'}
              . I can cancel my membership at any time by contacting customer
              care at {context.supportPhone}, online by emailing{' '}
              {
                <Link
                  variant="h5"
                  href={`mailto:${context.supportEmail}`}
                  target="_blank"
                  rel="noopener"
                >
                  {context.supportEmail}
                </Link>
              }{' '}
              or through our{' '}
              <Link
                variant="h5"
                href={context.contactForm}
                target="_blank"
                rel="noopener"
              >
                Contact Us
              </Link>{' '}
              form.
            </Text>
          </Stack>

          <Stack direction="row">
            {showCheckbox && (
              <Checkbox
                onChange={(e) => {
                  setTos2(e.target.checked);
                }}
                sx={(theme) => ({
                  padding: 1,
                  height: theme.spacing(4),
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                })}
              />
            )}
            <Text variant="body1">
              I understand and agree that {context.brandName} is NOT a "consumer
              reporting agency" as defined in the{' '}
              {
                <Link
                  variant="h5"
                  href={context.fcraLink}
                  target="_blank"
                  rel="noopener"
                >
                  Fair Credit Reporting Act
                </Link>
              }{' '}
              15 U.S.C §1681 et seq. {'(FCRA)'} and does NOT provide "consumer
              reports" as defined in FCRA. I acknowledge, agree, understand, and
              represent that I am NOT purchasing and will under NO circumstances
              use any information obtained from {context.brandName} as a factor
              in, or for any purpose in connection with, determining a person's
              eligibily for employment, tenacy, educational admission, benefits,
              credit, loans, insurance or for any other eligibility
              determination subject to FCRA or for any other purpose prohibited
              by the{' '}
              {
                <Link
                  variant="h5"
                  href={context.tosLink}
                  target="_blank"
                  rel="noopener"
                >
                  Terms of Service
                </Link>
              }
              . See our{' '}
              {
                <Link
                  variant="h5"
                  href={context.doDontsLink}
                  target="_blank"
                  rel="noopener"
                >
                  Do's & Don'ts
                </Link>
              }{' '}
              for further information.
            </Text>
          </Stack>
        </Stack>

        {paymentTypeMessage && (
          <Stack alignItems="center">
            <Text variant="body2" sx={{ textAlign: 'center' }}>
              {paymentTypeMessage}
            </Text>

            {onChangePaymentMethod && (
              <Button
                variant="text"
                disableRipple
                size="small"
                sx={(theme) => ({
                  marginTop: theme.spacing(1),
                  fontSize: theme.typography.fontSize * 0.8,
                  '&:hover': { background: 'none' },
                })}
                onClick={onChangePaymentMethod}
              >
                Change Payment Method
              </Button>
            )}
          </Stack>
        )}

        <Stack
          width={{
            xs: '100%',
            sm: cta.extraWide ? 200 : 170,
          }}
          alignItems="center"
        >
          <Button
            disabled={disabledButton}
            onClick={acceptTos}
            fullWidth
            variant="contained"
          >
            {cta.text}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};
