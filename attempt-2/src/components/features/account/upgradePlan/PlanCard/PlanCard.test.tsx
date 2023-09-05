import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { disableReactQueryErrorLogs } from '@/utils/TestUtils';
import { PlanCard, PlanCardProps } from './PlanCard';

disableReactQueryErrorLogs();

const props: PlanCardProps = {
  heading: 'Starter',
  subheading: 'Starting small and simple',
  limit: 100,
  cost: 29.99,
  renewalPeriod: 1,
  costPerReport: 0.33,
  onClick: jest.fn(),
};

test('renders the correct content', () => {
  const { asFragment } = render(<PlanCard {...props} />);

  expect(asFragment()).toMatchSnapshot();
});

test('renders required fields', () => {
  const { container } = render(<PlanCard {...props} />);

  expect(screen.getByRole('heading')).toHaveTextContent('Starter');
  expect(screen.getByText('Starting small and simple')).toBeInTheDocument();
  expect(screen.getByText('100 reports')).toBeInTheDocument();
  expect(screen.getByText('$29.99')).toBeInTheDocument();
  expect(screen.getAllByText('/mo')).toHaveLength(2);
  expect(screen.getByText('$0.33 per report')).toBeInTheDocument();
  expect(screen.getByRole('button')).toHaveTextContent('Upgrade plan');

  expect(container.firstChild).toHaveClass('plan-card');
  expect(container.firstChild).not.toHaveClass('hover-card');
  expect(container.firstChild).not.toHaveClass('most-popular');
  expect(screen.queryByText(/Most popular/)).not.toBeInTheDocument();
  expect(screen.queryByText(/% savings/i)).not.toBeInTheDocument();
});

// hoverCard css is broken in Safari, so we disable it for now - RS - 2023-05-03
// test('hover card', () => {
//   const { container } = render(<PlanCard {...props} hoverCard={true} />);

//   expect(container.firstChild).toHaveClass('hover-card');
// });

test('most popular', () => {
  const { container } = render(<PlanCard {...props} mostPopular={true} />);

  expect(container.firstChild).toHaveClass('most-popular');
  expect(screen.getByText(/Most popular/)).toBeInTheDocument();
});

test('savings', () => {
  render(<PlanCard {...props} savings={12} />);

  expect(screen.getAllByText(/12% savings/i)).toHaveLength(2);
});

test('unlimited', () => {
  render(<PlanCard {...props} limit={-1} />);

  expect(screen.getByText('Unlimited reports')).toBeInTheDocument();
});

test('multi month', () => {
  render(<PlanCard {...props} renewalPeriod={3} />);

  expect(screen.getByText('/mo')).toBeInTheDocument();
  expect(screen.getByText('/3 mo')).toBeInTheDocument();
});

test('decimal positions', () => {
  render(<PlanCard {...props} cost={20} costPerReport={2} />);

  expect(screen.getByText('$20.00')).toBeInTheDocument();
  expect(screen.getByText('$2.00 per report')).toBeInTheDocument();
});

test('selects plan', async () => {
  render(<PlanCard {...props} />);

  const selectPlan = screen.getByRole('button');

  await userEvent.click(selectPlan);

  expect(props.onClick).toHaveBeenCalled();
});
