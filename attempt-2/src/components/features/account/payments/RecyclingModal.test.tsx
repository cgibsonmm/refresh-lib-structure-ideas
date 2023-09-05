import { render, screen } from '@testing-library/react';
import { AppConstants, defaultConstants } from '@/context/AppConstants';
import { BrandThemeProvider } from '@/theme/index';
import { disableReactQueryErrorLogs, withQueryClient } from '@/utils/TestUtils';
import { RecyclingModal } from './RecyclingModal';

disableReactQueryErrorLogs();

const ModalComponent = () => {
  return (
    <RecyclingModal
      onClose={() => jest.fn()}
      open={true}
      openUpdatePayment={() => jest.fn()}
    />
  );
};

test('The PaymentSelection screen renders on the document', () => {
  const { asFragment } = render(withProviders(ModalComponent));
  expect(asFragment()).toMatchSnapshot();
  expect(screen.getByText('Not now')).toBeInTheDocument();
});

function withProviders(Component: () => JSX.Element) {
  return (
    <AppConstants.Provider value={defaultConstants}>
      <BrandThemeProvider>{withQueryClient({ Component })}</BrandThemeProvider>
    </AppConstants.Provider>
  );
}
