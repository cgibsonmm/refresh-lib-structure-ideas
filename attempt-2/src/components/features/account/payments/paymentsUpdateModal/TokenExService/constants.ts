export interface IframeConfig {
  authenticationKey: string;
  customRegEx: string;
  enableAutoComplete: boolean;
  enablePrettyFormat: boolean;
  enableValidateOnBlur: boolean;
  enableValidateOnKeyUp: boolean;
  inputType: 'text' | 'password' | 'number';
  origin: string;
  pci: boolean;
  placeholder: string;
  styles: { base: string; focus: string; error: string };
  timestamp: number;
  tokenExID: string;
  tokenScheme: string;
  font?: string;
}

export interface TokenExResponse {
  response: {
    success: boolean;
    authentication_key: string;
    origin: string;
    timestamp: number;
    token_ex_id: string;
    token_scheme: string;
  };
}

declare global {
  interface Window {
    TokenEx: {
      Iframe: new (targetId: string, config: IframeConfig) => Iframe;
    };
  }
}
export class Iframe {
  load?: () => void;
  tokenize?: () => void;
  validate?: () => void;
  remove?: () => void;
  DetokenizeIframe?: (options: { name: string; config: IframeConfig }) => void;
}

export const DEFAULT_TOKENEX_IFRAME_URL = '/api/v5/account/prep_iframe.json';
export const DEFAULT_TOKENEX_EVENT_ORIGIN = 'https://htp.tokenex.com';
export const CREDIT_CARD_REGEX = '^d{16}$';
export const TOKENEX_TARGET_ID = 'tokenex-iframe-target';

export const LOAD = 'load';
export const BLUR = 'blur';
export const FOCUS = 'focus';
export const ERROR = 'error';
export const EXPIRED = 'expired';
export const VALIDATE = 'validate';
export const TOKENIZE = 'tokenize';

export interface FormData {
  first_name: string;
  last_name: string;
  postal_code: string;
  expiration_month: string;
  expiration_year: string;
  verification_number: string;
  card_number: string;
  tokenex_token: string;
  tokenex_input: string;
}

export interface ValidateHandlerEvent {
  data: {
    validator: string;
    isValid: boolean;
  };
}

export type Year = {
  value: string;
  display: string;
};

export interface HandledEvents {
  [LOAD]: (() => void) | undefined;
  [BLUR]: (() => void) | undefined;
  [FOCUS]: (() => void) | undefined;
  [ERROR]: ((error: Error) => void) | undefined;
  [EXPIRED]: (() => void) | undefined;
  [VALIDATE]: ((event: ValidateHandlerEvent) => void) | undefined;
  [TOKENIZE]:
    | ((
        event: MessageEvent<{
          firstSix: string;
          lastFour: string;
          referenceNumber: string;
          token: string;
          tokenHMAC: string;
          cardType: string;
        }>
      ) => void)
    | undefined;
}

export interface Handlers {
  loadHandler?: () => void;
  blurHandler?: () => void;
  focusHandler?: () => void;
  onIFrameLoadError?: (error: Error) => void;
  onIframeExpired?: () => void;
  validateHandler?: (event: ValidateHandlerEvent) => void;
  tokenizeHandler?: (
    event: MessageEvent<{
      firstSix: string;
      lastFour: string;
      referenceNumber: string;
      token: string;
      tokenHMAC: string;
      cardType: string;
    }>
  ) => void;
}
