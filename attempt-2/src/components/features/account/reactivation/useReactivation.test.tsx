import { renderHook, act } from '@testing-library/react';
import { createQueryClient, createWrapper } from '@/utils/TestUtils';
import { useRedirect } from '@/utils/hooks/useRedirect';
import { useReactivation } from './useReactivation';
import { useAccount } from '../useAccount';

jest.mock('../useAccount');
jest.mock('@/utils/hooks/useRedirect');
jest.mock('@/context/AppConfig');

const useAccountMock = useAccount as jest.Mock;
const useRedirectMock = useRedirect as jest.Mock;

describe('useReactivation', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return true shouldRedirectOutOfReactivation when account is not past due', () => {
    const queryClient = createQueryClient();
    const wrapper = createWrapper(queryClient);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    useAccountMock.mockReturnValue({
      data: {
        account: {
          subscription_info: {
            normalize_date: futureDate.toISOString(),
          },
          notifications: {
            type: 'reactivation',
          },
          user_info: {
            noncompliant: false,
          },
        },
      },
    });

    useRedirectMock.mockReturnValue({
      redirect: jest.fn(),
    });

    const { result } = renderHook(
      () =>
        useReactivation({
          isAuthenticated: true,
          currentPathName: '/',
          reactivationPath: '/reactivation',
        }),
      { wrapper }
    );

    expect(result.current.shouldRedirectOutOfReactivation).toBe(true);
  });

  it('should redirect when the account is past due and on a different path', () => {
    const queryClient = createQueryClient();
    const wrapper = createWrapper(queryClient);

    const pastDueDate = new Date();
    pastDueDate.setDate(pastDueDate.getDate() - 1);

    useAccountMock.mockReturnValue({
      data: {
        account: {
          subscription_info: {
            normalize_date: pastDueDate.toISOString(),
          },
          notification: {
            type: 'reactivation',
          },
          user_info: {
            noncompliant: false,
          },
        },
      },
    });

    useRedirectMock.mockReturnValue({
      redirect: jest.fn(),
    });

    const { result } = renderHook(
      () =>
        useReactivation({
          isAuthenticated: true,
          currentPathName: '/',
          reactivationPath: '/reactivation',
        }),
      { wrapper }
    );

    expect(result.current.shouldRedirectOutOfReactivation).toBe(false);
    act(() => {
      expect(useRedirect().redirect).toHaveBeenCalledWith('/reactivation');
    });
  });
});
