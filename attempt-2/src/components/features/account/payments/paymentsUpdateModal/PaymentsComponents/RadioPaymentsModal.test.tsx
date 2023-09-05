import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { client_token, prep_iframe } from '@/mocks/RadioPaymentsMocks';
import { server } from '@/mocks/server';
import { BrandThemeProvider } from '@/theme/index';
import { disableReactQueryErrorLogs, withQueryClient } from '@/utils/TestUtils';
import 'jest-styled-components';
import { RadioPaymentsModal } from './RadioPaymentsModal';

disableReactQueryErrorLogs();

describe('RadioPaymentsModal', () => {
  test('Should render "Credit Or Debit card" button text', () => {
    server.use(
      rest.get('/api/v5/account/prep_iframe.json', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(prep_iframe));
      }),
      rest.get('/api/v5/braintree_client_token', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(client_token));
      })
    );
    render(
      withProviders(() => (
        <RadioPaymentsModal isOpen={true} onCloseHandle={() => 1} />
      ))
    );
    expect(screen.getByText('Credit or Debit card')).toBeInTheDocument();
    expect(screen.getByText('PayPal')).toBeInTheDocument();
  });

  function withProviders(Component: () => JSX.Element) {
    return (
      <BrandThemeProvider>{withQueryClient({ Component })}</BrandThemeProvider>
    );
  }
});
