import { render, fireEvent } from '@testing-library/react';
import { EditPlanCard } from './EditPlanCard';
import { SubscriptionPlan } from '../Interfaces';

const mockPlan = {
  title: 'Basic Plan',
  subtitle: 'Includes basic features',
  amount: 10000,
  internal_name: 'basic_plan',
};

const mockSelectedPlan = {
  title: 'Premium Plan',
  subtitle: 'Includes premium features',
  amount: 20000,
  internal_name: 'premium_plan',
};

const emptyFn = jest.fn();

describe('EditPlanCard', () => {
  it('renders', () => {
    const { asFragment } = render(
      <EditPlanCard
        plan={mockPlan as SubscriptionPlan}
        selectedPlan={mockSelectedPlan as SubscriptionPlan}
        handleSelectedPlan={emptyFn}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the title and subtitle correctly', () => {
    const { getByText } = render(
      <EditPlanCard
        plan={mockPlan as SubscriptionPlan}
        selectedPlan={mockSelectedPlan as SubscriptionPlan}
        handleSelectedPlan={emptyFn}
      />
    );
    expect(getByText('Basic Plan')).toBeInTheDocument();
    expect(getByText('Includes basic features')).toBeInTheDocument();
  });

  it('renders the amount correctly', () => {
    const { getByText } = render(
      <EditPlanCard
        plan={mockPlan as SubscriptionPlan}
        selectedPlan={mockSelectedPlan as SubscriptionPlan}
        handleSelectedPlan={emptyFn}
      />
    );
    expect(getByText('$100')).toBeInTheDocument();
  });

  it('renders the "Per month" text', () => {
    const { getByText } = render(
      <EditPlanCard
        plan={mockPlan as SubscriptionPlan}
        selectedPlan={mockSelectedPlan as SubscriptionPlan}
        handleSelectedPlan={emptyFn}
      />
    );
    expect(getByText('Per month plus')).toBeInTheDocument();
  });

  it('renders the sales tax text correctly', () => {
    const { getByText } = render(
      <EditPlanCard
        plan={mockPlan as SubscriptionPlan}
        selectedPlan={mockSelectedPlan as SubscriptionPlan}
        handleSelectedPlan={emptyFn}
      />
    );
    expect(getByText('applicable sales tax')).toBeInTheDocument();
  });

  it('calls the handleSelectedPlan function when clicked', () => {
    const mockHandleSelectedPlan = jest.fn();
    const { getByRole } = render(
      <EditPlanCard
        plan={mockPlan as SubscriptionPlan}
        selectedPlan={mockSelectedPlan as SubscriptionPlan}
        handleSelectedPlan={mockHandleSelectedPlan}
      />
    );
    fireEvent.click(getByRole('button'));
    expect(mockHandleSelectedPlan).toHaveBeenCalledWith(
      'basic_plan',
      undefined
    );
  });

  it('renders the checkbox as checked if the plan is selected', () => {
    const { getByRole } = render(
      <EditPlanCard
        plan={mockPlan as SubscriptionPlan}
        selectedPlan={mockPlan as SubscriptionPlan}
        handleSelectedPlan={emptyFn}
      />
    );
    const checkbox = getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  it('renders the checkbox as unchecked if the plan is not selected', () => {
    const { getByRole } = render(
      <EditPlanCard
        plan={mockPlan as SubscriptionPlan}
        selectedPlan={mockSelectedPlan as SubscriptionPlan}
        handleSelectedPlan={emptyFn}
      />
    );
    const checkbox = getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });
});
