import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { disableReactQueryErrorLogs } from '@/utils/TestUtils';
import {
  UpgradeFailureModal,
  UpgradeFailureModalProps,
} from './UpgradeFailureModal';

disableReactQueryErrorLogs();

const props: UpgradeFailureModalProps = {
  open: true,
  errors: [
    'Unfortunately, the card your are using was declined due to insufficient funds. You can try using a different card or pay with PayPal. If you are still unable to complete this payment, please call your bank or the phone number on the back of your card.',
  ],
  onClose: jest.fn(),
  onTryAgain: jest.fn(),
  onChangeCard: jest.fn(),
};

// For Documentation Purposes
//  Snapshot is not generated and stored as expected because
//  modals are rendered at a higher level in the DOM
//
// test('renders the correct content', () => {
//   const { asFragment } = render(<UpgradeSuccessModal {...props} />);

//   expect(asFragment()).toMatchSnapshot();
// });

test('renders the correct content', () => {
  render(<UpgradeFailureModal {...props} />);

  expect(
    screen.getByRole('heading', {
      name: 'Payment Failed',
      level: 1,
    })
  ).toBeInTheDocument();

  expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Change Card' })
  ).toBeInTheDocument();
});

test('allows the user to retry payment', async () => {
  render(<UpgradeFailureModal {...props} />);

  await userEvent.click(
    screen.getByRole('button', {
      name: 'Try Again',
    })
  );

  expect(props.onTryAgain).toHaveBeenCalledTimes(1);
});

test('allows the user to select a new card', async () => {
  render(<UpgradeFailureModal {...props} />);

  await userEvent.click(
    screen.getByRole('button', {
      name: 'Change Card',
    })
  );

  expect(props.onChangeCard).toHaveBeenCalledTimes(1);
});

test('dismisses modal when backdrop is clicked', async () => {
  const { baseElement } = render(<UpgradeFailureModal {...props} />);

  const backdrop = baseElement.getElementsByClassName('MuiBackdrop-root')[0];

  expect(backdrop).toBeInTheDocument();

  await userEvent.click(backdrop);

  expect(props.onClose).toHaveBeenCalled();
});
