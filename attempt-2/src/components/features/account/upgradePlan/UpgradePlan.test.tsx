import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { disableReactQueryErrorLogs } from '@/utils/TestUtils';
import { UpgradePlan, UpgradePlanProps } from './UpgradePlan';
import { currentPlanMock, plansMock } from './mocks';

disableReactQueryErrorLogs();

const props: UpgradePlanProps = {
  currentPlan: currentPlanMock,
  plans: plansMock,
  onSelectPlan: jest.fn(),
  onContactUs: jest.fn(),
};

test('renders the correct content', () => {
  const { asFragment } = render(<UpgradePlan {...props} />);

  expect(asFragment()).toMatchSnapshot();
});

test('renders the limit reached view', () => {
  const { container } = render(<UpgradePlan {...props} plans={[]} />);

  expect(container.getElementsByClassName('limit-reached').length).toBe(1);
});

test('renders current plan and upgrade options', () => {
  const { container } = render(<UpgradePlan {...props} />);

  expect(
    screen.getByRole('heading', {
      name: 'Unlock more reports and lower your cost per report',
      level: 1,
    })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', {
      name: 'Select a new plan and expand your search capabilities',
      level: 2,
    })
  ).toBeInTheDocument();

  expect(screen.getByText(/^Your current plan is/)).toBeInTheDocument();
  expect(screen.getByText('Starter')).toBeInTheDocument();
  expect(screen.getByText(/and includes/)).toBeInTheDocument();
  expect(
    screen.getByText('100 report credits ($0.27 per report)')
  ).toBeInTheDocument();

  expect(container.getElementsByClassName('plan-card').length).toBe(3);
  expect(screen.getByText('Need a customized solution?')).toBeInTheDocument();
  expect(screen.getByText('Still want more?')).toBeInTheDocument();
  expect(
    screen.getByText('Get a customized plan for your needs!')
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Contact us now' })
  ).toBeInTheDocument();
});

test('renders correct limit when subscription is unlimited', () => {
  render(
    <UpgradePlan
      {...props}
      currentPlan={{ ...currentPlanMock, limit: 'unlimited' }}
    />
  );

  expect(screen.getByText('unlimited report credits')).toBeInTheDocument();
});

test('renders cost per report only when provided', () => {
  render(
    <UpgradePlan
      {...props}
      currentPlan={{ ...currentPlanMock, costPerReport: undefined }}
    />
  );

  expect(screen.queryByText(/ per report\)$/)).not.toBeInTheDocument();
});

test('renders subscription description when canceled', () => {
  render(
    <UpgradePlan
      {...props}
      currentPlan={{ ...currentPlanMock, canceled: true }}
    />
  );

  expect(screen.queryByText(/^Your current plan is/)).not.toBeInTheDocument();
  expect(
    screen.getByText('Subscribe to run more reports today')
  ).toBeInTheDocument();
});

test('allows selecting a plan', async () => {
  render(<UpgradePlan {...props} />);

  const upgradeButtons = screen.getAllByRole('button', {
    name: 'Upgrade plan',
  });

  await userEvent.click(upgradeButtons[0]);

  expect(props.onSelectPlan).toHaveBeenCalledWith(plansMock[0]);
});

test('allows contacting us', async () => {
  render(<UpgradePlan {...props} />);

  await userEvent.click(screen.getByRole('button', { name: 'Contact us now' }));

  expect(props.onContactUs).toHaveBeenCalled();
});
