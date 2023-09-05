import { render, fireEvent } from '@testing-library/react';
import { AppConstants, defaultConstants } from '@/context/AppConstants';
import { BrandThemeProvider } from '@/theme/BrandThemeProvider';
import { withQueryClient } from '@/utils/TestUtils';
import { Reactivation } from './Reactivation';

const Component = () => {
  return <Reactivation />;
};

jest.mock('@/account/paymentMethodsService', () => ({
  useGetPaymentMethod: jest
    .fn()
    .mockReturnValue({ data: { payment_methods: [] }, isError: false }),
}));

jest.mock('@/account/useAccount', () => ({
  useAccount: jest.fn().mockReturnValue({
    data: {
      account: {
        subscription_info: {
          normalize_date: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      },
    },
    isError: false,
  }),
}));

jest.mock('./useReactivationPlans', () => ({
  useReactivationPlans: jest.fn().mockReturnValue({
    data: [
      { title: 'plan1', internal_name: 'plan1' },
      { title: 'plan2', internal_name: 'plan2' },
    ],
    isError: false,
  }),
}));

jest.mock('./useReactivation', () => ({
  useReactivation: jest
    .fn()
    .mockReturnValue({ shouldRedirectOutOfReactivation: false }),
}));

jest.mock('@/utils/hooks/useRedirect', () => ({
  useRedirect: jest.fn().mockReturnValue({ redirect: jest.fn() }),
}));

jest.mock('@/account/paymentMethodsService', () => ({
  // Mocked implementation of filterActivePaymentMethod
  filterActivePaymentMethod: jest.fn().mockImplementation(() => {
    // Mocked behavior of the function
    // Return your desired output for testing purposes
    // Example: return filteredPaymentMethods;
  }),
  useGetPaymentMethod: jest
    .fn()
    .mockReturnValue({ data: { payment_methods: [] }, isError: false }),
}));

describe('Reactivation', () => {
  test('renders reactivation form', () => {
    const { getByText } = render(withProviders(Component));
    expect(getByText('Reactivate your account today!')).toBeInTheDocument();
    expect(getByText('Your account expired 2 days ago')).toBeInTheDocument();
    expect(getByText('Activate Today')).toBeInTheDocument();
  });

  test('toggles edit plan form', () => {
    const { getByText } = render(withProviders(Component));
    fireEvent.click(getByText('Switch plan'));
    expect(getByText('plan1')).toBeInTheDocument();
    expect(getByText('Cancel selection')).toBeInTheDocument();
  });

  test('cancels edit plan form', () => {
    const { getByText } = render(withProviders(Component));
    fireEvent.click(getByText('Switch plan'));
    fireEvent.click(getByText('Cancel selection'));
    expect(getByText('Reactivate your account today!')).toBeInTheDocument();
  });

  test.skip('activates account', () => {
    const { getByText } = render(withProviders(Component));
    fireEvent.click(getByText('Activate Today'));
    // TODO: Add expectations for the activation functionality once implemented
  });
});

function withProviders(Component: () => JSX.Element) {
  return (
    <AppConstants.Provider value={defaultConstants}>
      <BrandThemeProvider>{withQueryClient({ Component })}</BrandThemeProvider>
    </AppConstants.Provider>
  );
}
