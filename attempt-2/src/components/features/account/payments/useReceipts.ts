import { useQuery } from 'react-query';
import { Receipt } from '@/account/Interfaces';
import { request } from '@/utils/requestHelpers';

//Hook to get all receipts.
export function useReceipts() {
  return useQuery(['getReceipts'], async () => {
    const paymentQuery = await request('/api/v5/receipts', {
      headers: new Headers({
        'content-type': 'application/x-www-form-urlencoded',
      }),
      method: 'GET',
    });
    formatReceipt(paymentQuery);
    return paymentQuery;
  });
}

//Format date, method and amount.
const formatReceipt = ({ receipts }: { receipts: Receipt[] }) => {
  receipts.forEach((receipt: Receipt) => {
    formatDate(receipt);
    formatAmount(receipt);
    formatMethod(receipt);
  });
};

const formatDate = (receipt: Receipt) => {
  const date = new Date(receipt.created_at);
  receipt.created_at = date.toLocaleDateString();
};

const formatAmount = (receipt: Receipt) => {
  const amountUSD = Number(receipt.amount) / 100;
  const usdFormater = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  receipt.amount = usdFormater.format(amountUSD);
};

const formatMethod = (receipt: Receipt) => {
  const method = receipt.method;
  if (method === 'BRAINTREE PAYMENT') {
    receipt.method = 'Apm'; //TODO: Handle APMs
    return;
  }
  const methodPart = receipt.method.split(' ');
  if (methodPart[1]) {
    receipt.method = methodPart[1].slice(1);
  }
};
