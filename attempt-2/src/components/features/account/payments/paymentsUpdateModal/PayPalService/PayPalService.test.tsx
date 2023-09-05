import { renderHook } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';
import { server } from '@/mocks/server';
import { usePayPalService } from './PayPalService';

const voidFunction = jest.fn();
const onBeforeProcessing = voidFunction;
const onAfterProcessing = voidFunction;
const onError = voidFunction;

describe('PayPalService', () => {
  it('should call initPayPal and fetch paypalurl.', () => {
    server.use(
      rest.get('/api/v5/paypal_settings/url', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      })
    );

    window.paypal = {
      checkout: {
        initXO: jest.fn(),
        setup: jest.fn(),
      },
      apps: {
        checkout: {
          closeFlow: jest.fn(),
        },
      },
    };

    jest.spyOn(React, 'useContext').mockReturnValue({
      routingUtils: {
        location: 'mocked-location',
      },
    });

    const { result } = renderHook(() =>
      usePayPalService({ onBeforeProcessing, onAfterProcessing, onError })
    );

    const customHookResult = result.current;
    jest.spyOn(customHookResult, 'initPayPal');

    customHookResult.initPayPal();

    expect(result.current.initPayPal).toHaveBeenCalled();
  });
});
