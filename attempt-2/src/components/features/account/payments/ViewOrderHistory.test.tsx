import { render, screen } from '@testing-library/react';
import { ViewOrderHistory } from '@/account/payments/ViewOrderHistory';
import { useReceipts } from '@/account/payments/useReceipts';
import { receiptsResponse } from '@/mocks/receipts';
import { disableReactQueryErrorLogs, withProviders } from '@/utils/TestUtils';
disableReactQueryErrorLogs();

jest.mock('./useReceipts.ts');

const useReceiptsMock = useReceipts as jest.MockedFunction<typeof useReceipts>;

test(`It renders the correct headers title when there's no error and there is data`, () => {
  (useReceiptsMock as jest.Mock).mockReturnValue({
    isError: false,
    data: receiptsResponse,
  });

  const { getByText } = render(withProviders(ViewOrderHistory));

  expect(getByText('TRANSACTION')).toBeInTheDocument();
});

test('It renders "No payment history found" when data is undefined', () => {
  (useReceiptsMock as jest.Mock).mockReturnValue({
    isError: false,
    data: undefined,
  });

  const { getByText } = render(withProviders(ViewOrderHistory));

  expect(getByText('No payment history found')).toBeInTheDocument();
});

test('It renders "No payment history found" when error is true', () => {
  (useReceiptsMock as jest.Mock).mockReturnValue({
    isError: true,
    data: receiptsResponse,
  });

  const { getByText } = render(withProviders(ViewOrderHistory));

  expect(getByText('No payment history found')).toBeInTheDocument();
});

test('The PaymentSelection screen renders on the document', () => {
  (useReceiptsMock as jest.Mock).mockReturnValue({
    isError: false,
    data: receiptsResponse,
  });

  const { asFragment } = render(withProviders(ViewOrderHistory));
  expect(asFragment()).toMatchSnapshot();
  expect(screen.getByText('TRANSACTION')).toBeInTheDocument();
});
