import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';

export const useBraintreeClient = () => {
  const [isCreatingClientInstance, setIsCreatingClientInstance] =
    useState<boolean>(false);
  const [isReadyForGateway, setIsReadyForGateway] = useState<boolean>(false);
  const [clientToken, setClientToken] = useState<string>('');
  const clientReadyHandlersQueueRef = useRef<((error?: Error) => void)[]>([]);
  const isTokenExpiredRef = useRef<boolean>(false);
  const clientInstanceRef = useRef<unknown>(null);
  const tokenExpirationTimeoutRef = useRef<number | undefined>(undefined);

  const API_URLS = {
    BRAINTREE_CLIENT_TOKEN_API: '/api/v5/braintree_client_token',
  };

  const fetchClientToken = async () => {
    const response = await fetch(API_URLS.BRAINTREE_CLIENT_TOKEN_API);
    const { client_token } = await response.json();
    return client_token;
  };

  const { data: token } = useQuery('clientToken', fetchClientToken);

  useEffect(() => {
    if (token) {
      setClientToken(token);
      setIsReadyForGateway(true);
    }
  }, [token]);

  const getClientInstance = async (
    readyHandler: (error?: unknown) => Promise<void>
  ) => {
    if (clientInstanceRef.current) {
      readyHandler();
      return;
    } else {
      clientReadyHandlersQueueRef.current.push(readyHandler);
    }

    if (!clientInstanceRef.current && !isCreatingClientInstance) {
      setIsCreatingClientInstance(true);
      try {
        setTokenExpirationTimeout();
        const clientInstance = await window.braintree.client.create({
          authorization: clientToken,
        });
        clientInstanceRef.current = clientInstance;
        processClientReadyHandlersQueue();
      } catch (error: unknown) {
        processClientReadyHandlersQueue(error as Error);
      } finally {
        setIsCreatingClientInstance(false);
      }
    }
  };

  const processClientReadyHandlersQueue = (error?: Error) => {
    clientReadyHandlersQueueRef.current.forEach((handler) => handler(error));
    clientReadyHandlersQueueRef.current = [];
  };

  const setTokenExpirationTimeout = () => {
    const tokenExpiration = 1000 * 60 * 60 * 24;

    window.clearTimeout(tokenExpirationTimeoutRef.current);

    tokenExpirationTimeoutRef.current = window.setTimeout(() => {
      clientInstanceRef.current = null;
      isTokenExpiredRef.current = true;
    }, tokenExpiration);
  };

  return {
    clientInstance: clientInstanceRef,
    isTokenExpired: isTokenExpiredRef,
    getClientInstance,
    isReadyForGateway,
  };
};
