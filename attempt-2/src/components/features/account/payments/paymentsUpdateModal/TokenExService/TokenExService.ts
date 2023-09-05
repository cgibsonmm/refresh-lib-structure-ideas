import { Theme, useTheme } from '@mui/material';
import { useContext } from 'react';
import { useQuery } from 'react-query';
import { AppConfig } from '@/context/AppConfig';
import * as tokenExConstants from './constants';
import {
  IframeConfig,
  TokenExResponse,
  Iframe as IframeType,
  HandledEvents,
  Handlers,
} from './constants';

export const THEME_STYLE = {
  border: '1px solid rgb(0 0 0 / 20%)',
  color: '#4a4a4a',
  width: '100%',
  height: '46px',
  padding: '0',
  'padding-left': '8px',
  margin: '0',
  outline: 'none',
  '-webkit-font-smoothing': 'antialiased',
  'background-color': 'transparent',
  'border-radius': '4px',
  'box-sizing': 'border-box',
  'font-weight': 'bold',
  'font-size': '18px',
};

const styleString = Object.entries(THEME_STYLE)
  .map(([key, value]) => `${key}:${value};`)
  .join('');

export const messageHandler = (
  event: MessageEvent,
  handlers: Handlers,
  logError: (context: string, error: Error) => void
) => {
  const handledEvents: HandledEvents = {
    [tokenExConstants.LOAD]: handlers?.loadHandler,
    [tokenExConstants.BLUR]: handlers?.blurHandler,
    [tokenExConstants.FOCUS]: handlers?.focusHandler,
    [tokenExConstants.ERROR]: handlers?.onIFrameLoadError,
    [tokenExConstants.EXPIRED]: handlers?.onIframeExpired,
    [tokenExConstants.VALIDATE]: handlers?.validateHandler,
    [tokenExConstants.TOKENIZE]: handlers?.tokenizeHandler,
  };

  if (event.origin !== tokenExConstants.DEFAULT_TOKENEX_EVENT_ORIGIN) {
    return;
  }

  const data = event.data;

  try {
    const messageType = {
      object: data,
      string: JSON.parse(data),
    };
    const message =
      messageType[typeof data as keyof typeof messageType] || null;

    if (message) {
      const event = message.event || message.action;
      handledEvents?.[event as keyof HandledEvents]?.(message);
    } else {
      logError(
        'Event does not follow format',
        Error('Event does not follow format')
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      logError('iframe_message_error', error);
    }
  }
};

export const useGetTokenExIframeSrc = () => {
  const theme = useTheme();
  const { logError } = useContext(AppConfig);

  return useQuery(['getTokenExIframeSrc'], () =>
    getTokenExIframeSrc(theme, logError)
  );
};

const getTokenExIframeSrc = async (
  theme: Theme,
  logError: (context: string, error: Error) => void
): Promise<IframeType | undefined> => {
  const result = await fetch(tokenExConstants.DEFAULT_TOKENEX_IFRAME_URL);
  const data: TokenExResponse = await result.json();

  if (data.response && data.response.success) {
    const tokenExIFrameConfig: IframeConfig = {
      authenticationKey: data.response.authentication_key,
      customRegEx: tokenExConstants.CREDIT_CARD_REGEX,
      enableAutoComplete: true,
      enablePrettyFormat: true,
      enableValidateOnBlur: true,
      enableValidateOnKeyUp: false,
      inputType: 'text',
      origin: data.response.origin,
      pci: true,
      placeholder: '',
      styles: {
        base: styleString,
        focus: `box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 2px solid ${theme.palette.primary.main};outline: 0;`,
        error: `box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid ${theme.palette.error.main};`,
      },
      timestamp: data.response.timestamp,
      tokenExID: data.response.token_ex_id,
      tokenScheme: data.response.token_scheme,
    };

    try {
      return new window.TokenEx.Iframe(
        tokenExConstants.TOKENEX_TARGET_ID,
        tokenExIFrameConfig
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        logError('iframe_instance_error', error);
      }
    }
  } else {
    logError('iframe_request_error', Error('iframe_request_error'));
  }
};
