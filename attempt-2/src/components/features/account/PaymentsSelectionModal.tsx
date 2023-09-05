import { useContext, useState } from 'react';
import { Navigation, Pagination, Swiper } from 'swiper';
import { PaymentImages, PaymentMethods } from '@/account/Interfaces';
import { useSession } from '@/auth/index';
import { AppConstants, Constants } from '@/context/AppConstants';
import { Text, Button, Carousel, Modal, styled } from '@/theme/index';
import {
  useGetPaymentMethod,
  SetDefaultMethodPaymentTest,
} from './paymentMethodsService';
import {
  useProcessCard,
  useProcessPayPal,
} from './payments/useSubscriptionUpgrade';

const CarouselWrapper = styled('div')(({ theme }) => ({
  '.payments-swiper': {
    width: '80%',
    padding: `${theme.spacing(1.25)} ${theme.spacing(1.25)} ${theme.spacing(
      3.125
    )} ${theme.spacing(1.25)}`,
  },

  '.carousel-div-wrapper': {
    display: 'flex',
    justifyContent: 'center',
  },
  '.swiper-carousel': {
    width: '80%',
  },

  '.swiperSlide': {
    minHeight: `${theme.spacing(20)}`,
    padding: `${theme.spacing(1.25)}`,
    marginBottom: `${theme.spacing(2.5)}`,
    boxShadow: `${theme.spacing(0)} ${theme.spacing(0.5)} ${theme.spacing(
      1
    )} ${theme.spacing(0)} rgba(0, 0, 0, 0.2), ${theme.spacing(
      0
    )} ${theme.spacing(0.5)} ${theme.spacing(2.5)} ${theme.spacing(
      0
    )} rgba(0, 0, 0, 0.19);`,
    borderRadius: `${theme.spacing(1.25)}`,
  },
  '.default-text': {
    position: 'absolute',
    right: `${theme.spacing(1.25)}`,
    bottom: `${theme.spacing(1.25)}`,
  },
  '.text-support': {
    wordBreak: 'break-word',
    maxHeight: `${theme.spacing(8)}`,
    overflow: 'hidden',
  },
  [theme.breakpoints.down('sm')]: {
    '.payments-swiper': {
      padding: `${theme.spacing(1.25)} ${theme.spacing(2)} ${theme.spacing(
        3.125
      )} ${theme.spacing(2)}`,
    },
    '.swiperSlide': {
      height: 'auto',
      marginBottom: `${theme.spacing(2.25)}`,
      minHeight: `${theme.spacing(28.75)}`,
    },
    '.text-support': {
      fontSize: `${theme.spacing(1.5)}`,
      overflow: 'hidden',
    },
    '.default-text': {
      bottom: `${theme.spacing(1.25)}`,
    },
    '.carousel-div-wrapper': {
      display: 'block',
    },
    '.swiper-carousel': {
      width: '100%',
    },
  },
}));

const FlexDivContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: `${theme.spacing(1.25)}`,
  justifyContent: 'space-between',

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    fontSize: `${theme.spacing(1.5)}`,
    alignItems: 'center',
  },
}));

const FlexDivCenter = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const CardColumn = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'space-between',
  marginBottom: `${theme.spacing(1.25)}`,
  gap: `${theme.spacing(2.5)}`,
  maxWidth: `${theme.spacing(18.75)}`,

  img: {
    width: `${theme.spacing(12.5)}`,
    height: `${theme.spacing(7.5)}`,
  },

  '.text-height': {
    minHeight: `${theme.spacing(7.5)}`,
  },

  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    alignItems: 'center',
    '.text-height': {
      minHeight: 'initial',
    },
  },
}));

const paymentImagesDictionary: { [key: string]: string } = {
  'Braintree::ApplePayCard': 'applePay',
  'Braintree::GooglePayCard': 'googlePay',
  'Braintree::VenmoAccount': 'venmo',
};

const displayBraintreeMethodName: { [key: string]: string } = {
  'Braintree::ApplePayCard': 'Apple Pay Account',
  'Braintree::GooglePayCard': 'Google Pay Account',
  'Braintree::VenmoAccount': 'Venmo Account',
};

const getSlideData = (
  slide: HTMLElement
): Pick<PaymentMethods, 'id' | 'payment_type'> => {
  const paymentTypes: { [key: string]: string } = {
    'Braintree::ApplePayCard': 'braintree',
    'Braintree::GooglePayCard': 'braintree',
    'Braintree::VenmoAccount': 'braintree',
    paypal: 'paypal',
    american_express: 'card',
    discover: 'card',
    master: 'card',
    visa: 'card',
  };

  if (!slide.dataset.id) throw new Error('Error selecting payment method id');

  const paymentType = slide.dataset.card_type || slide.dataset.braintree_type;

  if (!paymentType) throw new Error('Error selecting payment method type');

  const payment_type = paymentTypes[paymentType];

  return {
    id: parseInt(slide.dataset.id),
    payment_type: payment_type,
  };
};

const carouselElements = (
  { payment_methods }: { payment_methods: PaymentMethods[] },
  context: Constants
) => {
  return payment_methods.map((card: PaymentMethods, index: number) => {
    const isCreditCard = Boolean(card.expiration_month && card.expiration_year);
    const imgSrc =
      context[
        (card.card_type as keyof PaymentImages) ||
          (paymentImagesDictionary[card.braintree_type] as keyof PaymentImages)
      ];

    const paymentInformation = () => {
      if (card.card_type) {
        return isCreditCard ? card.description : card.email;
      }
      return displayBraintreeMethodName[card.braintree_type];
    };

    return (
      <div
        className="swiperSlide"
        data-id={card.id}
        data-card_type={card.card_type}
        data-braintree_type={card.braintree_type}
        key={index}
      >
        <FlexDivContainer>
          <CardColumn>
            <img src={imgSrc} alt="Card Logo" />
            {card.first_name && card.last_name && (
              <Text
                variant="caption"
                align="center"
                className="text-support"
              >{`${card.first_name} ${card.last_name}`}</Text>
            )}
          </CardColumn>
          <CardColumn>
            <Text variant="h5" margin={0} className="text-support text-height">
              {paymentInformation()}
            </Text>
            {isCreditCard && (
              <Text
                margin={0}
                variant="h5"
                className="text-support"
              >{`EXP ${card.expiration_month}/${card.expiration_year}`}</Text>
            )}
          </CardColumn>
        </FlexDivContainer>
        {card.active && (
          <Text
            variant="h2"
            align="right"
            className="text-support default-text"
          >
            DEFAULT
          </Text>
        )}
      </div>
    );
  });
};

/**
 * This component is a generic modal used to display a list of payment methods associated to the account.
 * It allows the user to select a payment method as default.
 */
export const PaymentsSelectionModal = ({
  open,
  cta = 'Make Default',
  inReactivation,
  isRecycling = false,
  onClose,
  onAddPaymentMethod,
  onSelectedPaymentMethod,
  defaultPaymentMethods,
}: {
  open: boolean;
  /** Custom text for the CTA button. */
  cta?: 'Make Default' | 'Use this Card' | (string & Record<never, never>);
  /**
   * Specifies if the modal is being used in the reactivation flow which changes the display
   * of the buttons from row to column.
   */
  inReactivation?: boolean;
  /**
   * Specifies if the modal is being used in the recycling flow which makes the main button inmediately
   * process the payment instead of setting it as default.
   */
  isRecycling?: boolean;
  /**
   * Callback fired when the user tries to close the modal by either
   * clicking on the close button, on the backdrop or by pressing the escape key
   */
  onClose: () => void;
  /** Callback fire when the user clicks the **Add Other Payment Methods** button. */
  onAddPaymentMethod?: (open: boolean) => void;
  /** Callback fired when a payment method was selected. */
  onSelectedPaymentMethod?: () => void;
  /** Default payment methods, if we fetch them outside the component */
  defaultPaymentMethods?: { payment_methods: PaymentMethods[] };
}) => {
  const [transitionInProgress, setTransitionInProgress] =
    useState<boolean>(false);
  const [swiper, setSwiper] = useState<Swiper | null>(null);
  const swiperSlideTo = (index: number) => swiper?.slideTo(index);

  let paymentMethods = defaultPaymentMethods;
  if (defaultPaymentMethods === undefined) {
    const { data } = useGetPaymentMethod();
    paymentMethods = data;
  }

  const { isError, refetch: refetchPaymentMethods } = useGetPaymentMethod();

  const defaultPaymentQuery = SetDefaultMethodPaymentTest(
    refetchPaymentMethods,
    swiperSlideTo
  );

  const processPaypalQuery = useProcessPayPal();
  const processCardQuery = useProcessCard();

  const {
    session: { account, isAuthenticated },
    useAccount,
  } = useSession();

  const { refetch: refetchAccount } = useAccount(isAuthenticated);

  const context = useContext(AppConstants);

  const processPaymentMethod = (
    slideData: Pick<PaymentMethods, 'id' | 'payment_type'>
  ) => {
    if (!account?.account.subscription_info?.subscription_plan_unique_name)
      return;
    const plan = {
      unique_key:
        account?.account.subscription_info?.subscription_plan_unique_name,
    };

    if (slideData.payment_type === 'paypal') {
      processPaypalQuery.mutate(
        {
          paymentAgreementId: slideData.id,
          plan,
        },
        {
          onSuccess: () => {
            refetchAccount();
            refetchPaymentMethods();
          },
        }
      );
    } else {
      processCardQuery.mutate(
        { creditCardId: slideData.id, plan },
        {
          onSuccess: () => {
            refetchAccount();
            refetchPaymentMethods();
          },
        }
      );
    }

    onClose();
  };

  return (
    <Modal
      title="Select from your payment methods"
      open={open}
      onClose={onClose}
      hasCloseIcon
      sx={{
        '& #modal-title': {
          fontSize: { xs: '16px', sm: '24px' },
          padding: { xs: '16px 24px 0px 24px', sm: '16px 24px' },
        },
      }}
    >
      {paymentMethods?.payment_methods?.length === 0 ||
      paymentMethods === undefined ||
      isError ? (
        <Text align="center" marginBottom={2}>
          No Payments associated to this account
        </Text>
      ) : (
        <>
          <FlexDivCenter>
            <Text
              variant="subtitle2"
              fontSize={{ xs: '14px', sm: '16px' }}
              gutterBottom
              className="text-support"
            >
              The payment method you select here will become your default
              payment for subscription payments and purchases
            </Text>
          </FlexDivCenter>
          <CarouselWrapper>
            <Carousel
              config={{
                slidesPerView: 1,
                spaceBetween: 150,
                speed: 500,
                loop: true,
                pagination: { clickable: true },
                navigation: {
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                },
                centeredSlides: true,
                modules: [Pagination, Navigation],
                className: 'payments-swiper',
                onSwiper: setSwiper,
                onSlideChangeTransitionStart: () =>
                  setTransitionInProgress(true),
                onSlideChangeTransitionEnd: () => {
                  setTransitionInProgress(false);
                },
              }}
              elements={carouselElements(paymentMethods, context)}
            />
          </CarouselWrapper>
        </>
      )}

      <FlexDivContainer
        sx={{ flexDirection: inReactivation ? 'column' : 'row' }}
      >
        <Button
          onClick={() => {
            if (!swiper) return;
            const activeSlide = swiper.slides[swiper.activeIndex];
            if (activeSlide instanceof HTMLElement) {
              const slideData = getSlideData(
                activeSlide.firstChild as HTMLElement
              );

              // TODO: should extract this logic to the parent component because here we are mixing concerns - RS 2023-06-01
              if (isRecycling) return processPaymentMethod(slideData);

              defaultPaymentQuery.mutate(Object.assign({}, slideData), {
                onSuccess: () => {
                  onSelectedPaymentMethod?.();
                },
              });
            }
          }}
          variant="contained"
          color="primary"
          disabled={transitionInProgress}
          sx={{
            fontSize: { xs: '14px', sm: '16px' },
          }}
        >
          {cta}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => onAddPaymentMethod?.(true)}
          sx={{
            fontSize: { xs: '14px', sm: '16px' },
          }}
        >
          Add Other Payment Methods
        </Button>
      </FlexDivContainer>
    </Modal>
  );
};
