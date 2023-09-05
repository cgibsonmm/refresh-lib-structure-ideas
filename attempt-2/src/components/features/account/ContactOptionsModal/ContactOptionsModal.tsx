import { ChangeEvent, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSession } from '@/auth/index';
import { AppConfig } from '@/context/AppConfig';
import { AppConstants } from '@/context/AppConstants';
import {
  Card,
  Modal,
  Radio,
  RadioGroup,
  Button,
  Stack,
  Text,
  useMediaQuery,
  useTheme,
} from '@/theme/index';
import { useRedirect } from '@/utils/hooks/useRedirect';
import { groupElements, Group } from '@/utils/index';

type Props = {
  /** If true, the modal is open */
  isOpen: boolean;
  /** Uncontrolled function for changing the value of 'isOpen' */
  setIsOpen: (isOpen: boolean) => void;
  /** Clean up function for handling any work that happens after the modal closes for any reason (esc, close button, or close via 'setIsOpen') */
  onCloseHandle: () => void;
  /** Function for opening the cancel confirmation modal */
  openConfirmCancelModal: () => void;
};

export const ContactOptionsModal = ({
  isOpen,
  setIsOpen,
  openConfirmCancelModal,
}: Props) => {
  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title="How can we help?"
      maxWidth={false}
      hasCloseIcon
    >
      <ContactOptions
        clickOrigin={null}
        setIsOpen={setIsOpen}
        openConfirmCancelModal={openConfirmCancelModal}
      />
    </Modal>
  );
};

type ClickOrigin = 'billing' | 'chat' | null;

type ContactOptionsProps = {
  clickOrigin: ClickOrigin;
  setIsOpen: (isOpen: boolean) => void;
  openConfirmCancelModal: () => void;
};

type CustomEvent = {
  eventAction: string;
  eventCategory: string;
  eventLabel: string;
};

type ContactOption = {
  name: string;
  display: string;
  customLink?: string;
  customEvents?: CustomEvent[];
};

const ContactOptions = ({
  clickOrigin = null,
  setIsOpen,
  openConfirmCancelModal,
}: ContactOptionsProps) => {
  const { trackEvent } = useContext(AppConfig);
  const {
    contactForm: contactFormUrl,
    brandLink: domain,
    billingLink,
    customPlanLink,
  } = useContext(AppConstants);
  const { redirect } = useRedirect();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    session: { account },
  } = useSession();

  const supportTopics = buildSupportTopics(clickOrigin, customPlanLink);
  const firstOption = supportTopics[0];
  const [currentOption, setCurrentOption] =
    useState<ContactOption>(firstOption);
  const [groupedSupportTopics, setGroupedSupportTopics] = useState<
    Group<ContactOption>[]
  >([]);

  useEffect(() => {
    // Memoize this so we have static UUIDs over each render
    const groupByTwo = groupElements(2);
    const supportTopicElements = supportTopics.map((topic) => ({
      id: uuidv4(),
      value: topic,
    }));
    const groupedTopics = groupByTwo(supportTopicElements);
    setGroupedSupportTopics(groupedTopics);
  }, [clickOrigin]);

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const { value } = event.target as HTMLInputElement;
    trackEvent(value, 'select', 'contact us');

    const newOption =
      supportTopics.find((topic) => topic.name === value) || firstOption;

    if (newOption.customEvents) {
      newOption.customEvents.forEach(
        ({ eventAction, eventCategory, eventLabel }) =>
          trackEvent(eventAction, eventCategory, eventLabel)
      );
    }

    setCurrentOption(newOption);
  };

  const redirectUrl = (topic = 'cancel') => {
    const email = encodeURIComponent(
      account ? account.account.user_info.email : ''
    );

    return `${contactFormUrl}?topic=${topic}&email_address=${email}`;
  };

  const handleNextStep = (option: ContactOption) => {
    trackEvent('click', 'contact us', 'contact form');
    trackEvent(option.name, 'contact us', 'submit');

    if (option.customLink) {
      window.open(option.customLink, '_blank', 'noopener,noreferrer');
    } else if (option.name === 'upgrade') {
      redirect('/upgrade/plan');
    } else if (option.name === 'cancel') {
      openConfirmCancelModal();
      // TODO: Assume billing FAQ test passes
    } else if (option.name === 'billing') {
      window.open(billingLink, '_blank', 'noopener,noreferrer');
    } else if (option.name === 'agent') {
      window.open(`${domain}/chat`, '_blank', 'noopener,noreferrer');
    } else {
      window.open(redirectUrl(option.name), '_blank', 'noopener,noreferrer');
    }

    window.scrollTo(0, 0);
    setIsOpen(false);
  };

  const ContactOption = ({ topic }: { topic: ContactOption }) => (
    <Card
      sx={{
        width: '290px',
        height: '60px',
        marginBottom: 0.5,
        padding: 0,
      }}
      variant="outlined"
    >
      <Stack direction="row" alignItems="center" gap={2} padding={1}>
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Radio
            value={topic.name}
            checked={topic.name === currentOption.name}
          />
          <Text>{topic.display}</Text>
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Stack spacing={1.5}>
        <RadioGroup onChange={handleRadioChange}>
          {isMobile
            ? supportTopics.map((topic, index) => (
                <ContactOption key={index} topic={topic} />
              ))
            : groupedSupportTopics.map(({ data, id: groupId }) => (
                <Stack key={groupId} direction="row" spacing={1.25}>
                  {data.map(({ id, value }) => (
                    <ContactOption key={id} topic={value} />
                  ))}
                </Stack>
              ))}
        </RadioGroup>
      </Stack>
      <Stack
        direction={isMobile ? 'column' : 'row'}
        alignItems="center"
        justifyContent="center"
        spacing={isMobile ? 1.5 : 4}
      >
        <Button
          sx={{ minWidth: '150px' }}
          onClick={() => handleNextStep(currentOption)}
        >
          Continue
        </Button>
        <Button
          sx={{ minWidth: '150px' }}
          variant="contained"
          onClick={() => setIsOpen(false)}
        >
          Take Me Back
        </Button>
      </Stack>
    </Stack>
  );
};

const buildDefaultTopics = (clickOrigin: ClickOrigin) => {
  const baseTopics = [
    {
      name: 'general_support',
      display: 'General Support',
    },
    {
      name: 'partnership_inquiries',
      display: 'Partnership Inquiries',
    },
    {
      name: 'technical_question',
      display: 'Technical Questions',
    },
    {
      name: 'press',
      display: 'Press',
    },
    {
      name: 'permissible_uses',
      display: 'Is my use case allowed?',
    },
    {
      name: 'privacy_opt_out',
      display: 'Remove my info',
    },
    {
      name: 'other',
      display: 'Other',
    },
  ];

  const billingTopics = [
    {
      name: 'upgrade',
      display: 'Upgrade my account',
    },
    {
      name: 'cancel',
      display: 'Cancel my account',
    },
    {
      name: 'billing',
      display: 'Billing FAQ',
    },
  ];

  const chatTopics = [
    {
      name: 'cancel',
      display: 'Cancel my account',
    },
    {
      name: 'agent',
      display: 'Talk to an agent',
    },
  ];

  if (clickOrigin === 'chat') {
    return chatTopics;
  } else if (clickOrigin === 'billing') {
    return billingTopics;
  } else {
    return [...billingTopics, ...baseTopics];
  }
};

const buildSupportTopics = (
  clickOrigin: ClickOrigin,
  customPlanLink: string
): ContactOption[] => {
  const defaultTopics = buildDefaultTopics(clickOrigin);

  const customEvents = [
    {
      eventAction: 'custom plan form',
      eventCategory: 'upgrade',
      eventLabel: 'contact form modal',
    },
    {
      eventAction: 'select',
      eventCategory: 'contact us',
      eventLabel: 'custom plan',
    },
  ];
  const customPlanTopic = {
    name: 'custom_larger_plan',
    display: 'Request custom/larger plan',
    customLink: customPlanLink,
    customEvents,
  };

  return [...defaultTopics, customPlanTopic];
};
