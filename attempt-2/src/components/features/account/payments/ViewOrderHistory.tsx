import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/system';
import { Receipt } from '@/account/Interfaces';
import { useReceipts } from '@/account/payments/useReceipts';
import { Text, Table, Accordion, Icons } from '@/theme/index';

export const FlexDiv = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

export const ValueDiv = styled('div')({
  width: '50%',
  textAlign: 'right',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
});

const renderHeader = (isMobile: boolean) => {
  //Mobile table headers
  if (isMobile) {
    return ['TRANSACTION'];
  }

  //Desktop table headers.
  return ['DATE', 'TRANSACTION', 'BILLED', 'AMOUNT'];
};

const PaymentMethod = (props: Receipt) => {
  return (
    <FlexDiv>
      <Icons.CreditCard />
      <Text variant="caption">{props?.method}</Text>
    </FlexDiv>
  );
};

const renderContent = (object: Receipt[], isMobile: boolean) => {
  if (object === undefined || object.length === 0) {
    //No receipts.
    return [[]];
  }

  //Mobile table content
  if (isMobile) {
    return object.map((value: Receipt) => {
      return [
        <>
          <Text variant="h3">{value.created_at}</Text>
          <Text variant="body2">{value?.items[0]?.description}</Text>
          <FlexDiv>
            <div style={{ width: '50%' }}>{PaymentMethod(value)}</div>
            <ValueDiv>
              <Text variant="caption">{value.amount}</Text>
            </ValueDiv>
          </FlexDiv>
        </>,
      ];
    });
  }

  //Desktop table content
  return object.map((value: Receipt) => {
    return [
      value?.created_at,
      value?.items[0]?.description,
      PaymentMethod(value),
      <Text marginLeft={1}>{value?.amount}</Text>,
    ];
  });
};

/**
 * This component is used to display the user's order history which includes the date, transaction,
 * payment method used, and amount.
 */
export const ViewOrderHistory = () => {
  const { data, isError } = useReceipts();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Accordion display="View order history" data-cy="order_history">
      <Table
        data-cy="order_history_data"
        headers={
          data?.receipts?.length === 0 || data === undefined || isError
            ? ['No payment history found']
            : renderHeader(isMobile)
        }
        rows={renderContent(data?.receipts, isMobile)}
      />
    </Accordion>
  );
};
