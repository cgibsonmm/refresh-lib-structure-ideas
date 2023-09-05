import { renderHook, act } from '@testing-library/react';
import {
  createQueryClient,
  createWrapper,
  disableReactQueryErrorLogs,
} from '@/utils/TestUtils';
import * as BraintreeClientService from './BraintreeClientService';
import { useBraintreeGatewayService } from './BraintreeGatewayService';

disableReactQueryErrorLogs();

describe('useBraintreeGatewayService', () => {
  jest.mock('./BraintreeClientService');

  it('should initialize payment and call the client callback', async () => {
    const mockClientInstance = { current: 'mockedClientInstance' };
    const mockIsTokenExpired = { current: false };
    const mockIsReadyForGateway = true;
    const mockGetClientInstance = jest.fn();

    const mockUseBraintreeClient = jest.fn(() => ({
      clientInstance: mockClientInstance,
      isTokenExpired: mockIsTokenExpired,
      getClientInstance: mockGetClientInstance,
      isReadyForGateway: mockIsReadyForGateway,
    }));

    jest
      .spyOn(BraintreeClientService, 'useBraintreeClient')
      .mockImplementation(mockUseBraintreeClient);

    const beforeClientCreationHandler = jest.fn();
    const setPaymentMethodSupport = jest.fn().mockResolvedValue(true);
    const paymentInstanceCreatedHandler = jest.fn();
    const submitter = document.createElement('button');
    const submitHandler = jest.fn();
    const clientCreationErrorHandler = jest.fn();

    const queryClient = createQueryClient();
    const wrapper = createWrapper(queryClient);

    const { result } = renderHook(
      () =>
        useBraintreeGatewayService('googlePayment', {
          beforeClientCreationHandler,
          setPaymentMethodSupport,
          clientCreationErrorHandler,
          paymentInstanceCreatedHandler,
          submitter,
          submitHandler,
        }),
      { wrapper }
    );

    act(() => {
      result.current.initializePaymentGateway();
    });

    expect(beforeClientCreationHandler).toHaveBeenCalledWith(true);
    expect(mockGetClientInstance).toHaveBeenCalled();
  });
});
