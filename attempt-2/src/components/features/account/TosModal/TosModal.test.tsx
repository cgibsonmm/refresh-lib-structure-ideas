import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { disableReactQueryErrorLogs } from '@/utils/TestUtils';
import { TosModal, TosModalProps } from './TosModal';

disableReactQueryErrorLogs();

const props: TosModalProps = {
  open: true,
  onClose: jest.fn(),
  acceptTos: jest.fn(),
  showCheckbox: true,
  billingFrecuency: 'a one time',
  billedPrice: 1.5,
};

describe('TosModal', () => {
  test('should render heading and subheading', () => {
    render(<TosModal {...props} />);

    expect(screen.getByText('One last step!')).toBeInTheDocument();
    expect(
      screen.getByText('Review & accept the agreement below')
    ).toBeInTheDocument();
  });

  test('should enable button when showCheckbox is disabled', () => {
    render(<TosModal {...props} showCheckbox={false} />);

    expect(screen.getByRole('button', { name: 'Accept' })).toBeEnabled();
  });

  test('should disable button when checkbox is not checked', () => {
    render(<TosModal {...props} />);

    expect(screen.getByRole('button', { name: 'Accept' })).toBeDisabled();
  });

  test('should enable button when checkbox is checked', async () => {
    render(<TosModal {...props} />);

    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes).toHaveLength(2);

    await userEvent.click(checkboxes[0]);
    await userEvent.click(checkboxes[1]);

    expect(screen.getByRole('button', { name: 'Accept' })).toBeEnabled();
  });

  test('should show upgrade button text', () => {
    render(<TosModal {...props} cta={{ text: 'Accept and Upgrade' }} />);

    expect(
      screen.getByRole('button', { name: 'Accept and Upgrade' })
    ).toBeInTheDocument();
  });
});
