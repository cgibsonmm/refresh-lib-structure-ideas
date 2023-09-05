import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { withQueryClient } from '@/utils/TestUtils';
import { DateUtil } from '@/utils/index';
import { ReactivatePausedAccountCta } from './ReactivatePausedAccountCta';
import { pausedAccountMock } from './mocks';

const expiry = pausedAccountMock.account.subscription_info.normalize_date;
const dateUtil = new DateUtil();

test('it displays the number of reports left and the date of expiration', () => {
  renderFull();

  expect(screen.getByTestId('reports-left')).toHaveTextContent('100');

  expect(screen.getByTestId('expiration-date')).toHaveTextContent(
    `Reports left until ${dateUtil.parseDateFromString(expiry, 'MMM d')}`
  );
});

test('it displays the number of days left', () => {
  renderFull();

  const days = dateUtil.getDaysDiffFromNow(expiry) || 0;

  expect(screen.getByTestId('days-left')).toHaveTextContent(
    `${days.toString()}Days left of your membership`
  );
});

test('it displays the date the membership will expire and a message encouraging reactivation', () => {
  renderFull();

  expect(screen.getByTestId('reactivate-message')).toHaveTextContent(
    `Your membership ends on ${dateUtil.parseDateFromString(expiry, 'M/d')}`
  );

  expect(screen.getByTestId('reactivate-message')).toHaveTextContent(
    'Activate today to maintain access'
  );
});

test('it displays the users billing info', () => {
  renderFull();

  expect(screen.getByTestId('card-number')).toHaveTextContent(`XX-XXXX`);
});

test('it allows the user to edit their billing info', () => {
  renderFull();

  expect(screen.getByTestId('edit-billing')).toBeInTheDocument();
});

test('it displays a button to reactivate', () => {
  renderFull();

  expect(screen.getByTestId('reactivate-button')).toHaveTextContent(
    'Activate today'
  );
});

test('it can open the reactivation modal', async () => {
  renderFull();

  await userEvent.click(screen.getByTestId('reactivate-button'));

  expect(
    screen.getByText('Review & accept the agreement below')
  ).toBeInTheDocument();
});

function renderFull() {
  const session = {
    isAuthenticated: true,
    account: pausedAccountMock,
    userInRecycling: true,
    userHasRecyclingReportsRemaining: true,
  };

  render(
    <>
      {withQueryClient({
        Component: () => <ReactivatePausedAccountCta />,
        session,
      })}
    </>
  );
}

jest.mock('@/account/paymentMethodsService', () => ({
  // Mocked implementation of filterActivePaymentMethod
  filterActivePaymentMethod: jest.fn().mockImplementation((paymentMethods) => {
    if (!(paymentMethods && Array.isArray(paymentMethods.payment_methods)))
      return;
    return paymentMethods.payment_methods.filter(
      (payment: { active: boolean }) => payment.active
    )[0];
  }),
  useGetPaymentMethod: jest.fn().mockReturnValue({
    data: {
      payment_methods: [
        {
          payment_type: 'paypal',
          id: 1,
          active: true,
        },
      ],
    },
    isError: false,
  }),
  SetDefaultMethodPaymentTest: jest
    .fn()
    .mockImplementation((refetch, slideTo) => {
      console.log(refetch + slideTo);
    }),
}));

jest.mock('../useReactivationPlans', () => ({
  useReactivationPlans: jest.fn().mockReturnValue({
    data: [
      { title: 'plan1', internal_name: 'plan1' },
      { title: 'plan2', internal_name: 'plan2' },
    ],
    isError: false,
  }),
}));
