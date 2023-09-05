import { render, screen } from '@testing-library/react';
import { AppConstants, defaultConstants } from '@/context/AppConstants';
import { getPaymentMethodsHandler } from '@/mocks/handlers';
import { server } from '@/mocks/server';
import { BrandThemeProvider, Modal } from '@/theme/index';
import { disableReactQueryErrorLogs, withQueryClient } from '@/utils/TestUtils';
import { PaymentsSelectionModal } from './PaymentsSelectionModal';

disableReactQueryErrorLogs();

const Component = () => {
  const onClose = jest.fn();

  return (
    <Modal open={true}>
      <PaymentsSelectionModal
        open
        onClose={onClose}
        defaultPaymentMethods={{ payment_methods: [] }}
      />
    </Modal>
  );
};

test('The PaymentSelection screen renders on the document', () => {
  server.use(getPaymentMethodsHandler);

  const { asFragment } = render(withProviders(Component));

  expect(asFragment()).toMatchSnapshot();
  expect(screen.getByText('Make Default')).toBeInTheDocument();
});

function withProviders(Component: () => JSX.Element) {
  return (
    <AppConstants.Provider value={defaultConstants}>
      <BrandThemeProvider>{withQueryClient({ Component })}</BrandThemeProvider>
    </AppConstants.Provider>
  );
}
