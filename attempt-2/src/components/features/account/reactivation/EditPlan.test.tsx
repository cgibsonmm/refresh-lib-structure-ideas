import { render, screen, fireEvent } from '@testing-library/react';
import { dollarize } from '@/utils/dollarize';
import { EditPlan } from './EditPlan';
import { SubscriptionPlan } from '../Interfaces';

const plans = [
  {
    internalName: 'basic',
    title: 'Basic Plan',
    amount: 1000,
  },
  {
    internalName: 'pro',
    title: 'Pro Plan',
    amount: 2000,
  },
];

const selectedPlan = {
  internalName: 'pro plus',
  title: 'Pro Plan',
  amount: 200000,
};

const fnWithArg = jest.fn((title) => title);
const emptyFn = jest.fn();

describe('EditPlan', () => {
  it('renders', () => {
    const { asFragment } = render(
      <EditPlan
        plans={plans as unknown as SubscriptionPlan[]}
        selectedPlan={selectedPlan as unknown as SubscriptionPlan}
        handleSelectedPlan={fnWithArg}
        toggleEditPlan={emptyFn}
        handleCancelClick={emptyFn}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the list of plans', () => {
    render(
      <EditPlan
        plans={plans as unknown as SubscriptionPlan[]}
        selectedPlan={selectedPlan as unknown as SubscriptionPlan}
        handleSelectedPlan={fnWithArg}
        toggleEditPlan={emptyFn}
        handleCancelClick={emptyFn}
      />
    );

    const planNames = plans.map((plan) => screen.getByText(plan.title));
    expect(planNames).toHaveLength(plans.length);
  });

  it('displays the selected plan amount', () => {
    render(
      <EditPlan
        plans={plans as unknown as SubscriptionPlan[]}
        selectedPlan={selectedPlan as unknown as SubscriptionPlan}
        handleSelectedPlan={fnWithArg}
        toggleEditPlan={emptyFn}
        handleCancelClick={emptyFn}
      />
    );

    const amountText = screen.getByText(dollarize(selectedPlan.amount));
    expect(amountText).toBeInTheDocument();
  });

  it('calls toggleEditPlan when the "Select this plan" button is clicked', () => {
    const toggleEditPlan = jest.fn();
    render(
      <EditPlan
        plans={plans as unknown as SubscriptionPlan[]}
        selectedPlan={selectedPlan as unknown as SubscriptionPlan}
        handleSelectedPlan={fnWithArg}
        toggleEditPlan={toggleEditPlan}
        handleCancelClick={emptyFn}
      />
    );

    fireEvent.click(screen.getByText('Select this plan'));

    expect(toggleEditPlan).toHaveBeenCalled();
  });

  it('calls handleCancelClick when the "Cancel selection" button is clicked', () => {
    const handleCancelClick = jest.fn();
    render(
      <EditPlan
        plans={plans as unknown as SubscriptionPlan[]}
        selectedPlan={selectedPlan as unknown as SubscriptionPlan}
        handleSelectedPlan={fnWithArg}
        toggleEditPlan={emptyFn}
        handleCancelClick={handleCancelClick}
      />
    );

    fireEvent.click(screen.getByText('Cancel selection'));

    expect(handleCancelClick).toHaveBeenCalled();
  });
});
