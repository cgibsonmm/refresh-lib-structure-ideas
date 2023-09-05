import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LimitReached, LimitReachedProps } from './LimitReached';

const props: LimitReachedProps = {
  onContactUs: jest.fn(),
};

test('renders the correct content', () => {
  const { asFragment } = render(<LimitReached {...props} />);

  expect(asFragment()).toMatchSnapshot();
});

test('contact us', async () => {
  render(<LimitReached {...props} />);

  const contactUs = screen.getByRole('button');

  await userEvent.click(contactUs);

  expect(props.onContactUs).toHaveBeenCalled();
});
