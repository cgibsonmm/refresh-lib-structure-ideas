import { fireEvent, render } from '@testing-library/react';
import { useState } from 'react';
import { AppConstants, defaultConstants } from '@/context/AppConstants';
import { getPaymentMethodsHandler } from '@/mocks/handlers';
import { server } from '@/mocks/server';
import { BrandThemeProvider } from '@/theme/BrandThemeProvider';
import { withQueryClient } from '@/utils/TestUtils';
import { PaymentContainer } from './PaymentContainer';
import { PaymentMethods, SubscriptionPlan } from '../Interfaces';

describe('PaymentContainer', () => {
  const paymentMethod = [{ card_type: 'visa', last_four: '1234' }];
  const selectedPlan = {
    title: 'Basic',
    public_price_description: '$10/month',
    renewal_period: 1,
    renewal_period_type: 'month',
    amount: 1000,
  };
  const toggleEditPlan = jest.fn();

  const Component = () => {
    const [openEditPayment, setOpenEditPayment] = useState(false);
    const toggleEditPayment = () => {
      setOpenEditPayment((prevState) => !prevState);
    };
    return (
      <PaymentContainer
        paymentMethod={paymentMethod as unknown as PaymentMethods[]}
        toggleEditPlan={toggleEditPlan}
        selectedPlan={selectedPlan as SubscriptionPlan}
        toggleEditPayment={toggleEditPayment}
        openEditPayment={openEditPayment}
      />
    );
  };

  it('should display the correct payment method and billing information', () => {
    const { getByAltText, getByText, getByTestId } = render(
      withProviders(Component)
    );

    expect(getByAltText('Card Logo')).toBeInTheDocument();
    expect(getByText('XX-1234')).toBeInTheDocument();
    expect(getByText('Edit Billing')).toBeInTheDocument();
    expect(getByText('Basic')).toBeInTheDocument();
    expect(
      getByText('$10 / Month plus applicable sales tax')
    ).toBeInTheDocument();
    expect(getByTestId('edit-billing')).toBeInTheDocument();
    expect(getByTestId('switch-plan')).toBeInTheDocument();
    expect(getByTestId('plan-price')).toBeInTheDocument();
  });

  it('should toggle the edit payment modal when the "Edit Billing" button is clicked', () => {
    server.use(getPaymentMethodsHandler);

    const { getByTestId, queryByText } = render(withProviders(Component));

    expect(
      queryByText('Select from your payment methods')
    ).not.toBeInTheDocument();
    fireEvent.click(getByTestId('edit-billing'));
    expect(queryByText('Select from your payment methods')).toBeInTheDocument();
    fireEvent.click(getByTestId('edit-billing'));
    expect(
      queryByText('Select from your payment methods')
    ).not.toBeInTheDocument();
  });

  it('should call the toggleEditPlan function when the "Switch plan" button is clicked', () => {
    const { getByTestId } = render(withProviders(Component));

    fireEvent.click(getByTestId('switch-plan'));
    expect(toggleEditPlan).toHaveBeenCalled();
  });
});

function withProviders(Component: () => JSX.Element) {
  return (
    <AppConstants.Provider value={defaultConstants}>
      <BrandThemeProvider>{withQueryClient({ Component })}</BrandThemeProvider>
    </AppConstants.Provider>
  );
}
