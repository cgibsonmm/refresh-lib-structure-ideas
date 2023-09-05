import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { disableReactQueryErrorLogs } from '@/utils/TestUtils';
import {
  UpgradeSuccessModal,
  UpgradeSuccessModalProps,
} from './UpgradeSuccessModal';

disableReactQueryErrorLogs();

const props: UpgradeSuccessModalProps = {
  open: true,
  onAccept: jest.fn(),
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
  render(<UpgradeSuccessModal {...props} />);

  expect(
    screen.getByRole('heading', {
      name: 'Success! Your subscription is now active',
      level: 1,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: 'View Dashboard' })
  ).toBeInTheDocument();
});

test('dismisses modal when button is clicked', async () => {
  render(<UpgradeSuccessModal {...props} />);

  await userEvent.click(
    screen.getByRole('button', {
      name: 'View Dashboard',
    })
  );

  expect(props.onAccept).toHaveBeenCalledTimes(1);
});

test('does not dismiss modal when backdrop is clicked', async () => {
  const { baseElement } = render(<UpgradeSuccessModal {...props} />);

  const backdrop = baseElement.getElementsByClassName('MuiBackdrop-root')[0];

  expect(backdrop).toBeInTheDocument();

  await userEvent.click(backdrop);

  expect(props.onAccept).not.toHaveBeenCalled();
});
