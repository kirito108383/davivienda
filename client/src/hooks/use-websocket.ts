import { useEffect, useRef, useCallback } from 'react';

interface UseWebSocketOptions {
  url?: string;
  onMessage?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useWebSocket = ({
  url = `wss://${window.location.host}`,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
  reconnectInterval = 5000,
  maxReconnectAttempts = 5
}: UseWebSocketOptions = {}) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectedRef = useRef(false);

  const connect = useCallback(() => {
    try {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log('🔗 WebSocket conectado');
        isConnectedRef.current = true;
        reconnectAttemptsRef.current = 0;
        onConnect?.();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket mensaje recibido:', data);
          onMessage?.(data);
        } catch (error) {
          console.error('❌ Error parseando mensaje WebSocket:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('🔌 WebSocket desconectado');
        isConnectedRef.current = false;
        onDisconnect?.();
        attemptReconnect();
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ Error WebSocket:', error);
        onError?.(error);
      };

    } catch (error) {
      console.error('❌ Error creando conexión WebSocket:', error);
      attemptReconnect();
    }
  }, [url, onConnect, onDisconnect, onError, onMessage]);

  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current < maxReconnectAttempts) {
      reconnectAttemptsRef.current += 1;
      console.log(`🔄 Intentando reconectar... (intento ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);

      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, reconnectInterval);
    } else {
      console.error('❌ Máximo número de intentos de reconexión alcanzado');
    }
  }, [connect, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    isConnectedRef.current = false;
  }, []);

  const send = useCallback((data: any) => {
    if (wsRef.current && isConnectedRef.current) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn('⚠️ WebSocket no conectado, mensaje no enviado:', data);
    }
  }, []);

  // Suscribirse a eventos específicos
  const subscribe = useCallback((eventType: string, callback: (data: any) => void) => {
    const wrappedCallback = (data: any) => {
      if (data.type === eventType) {
        callback(data);
      }
    };

    // Crear un nuevo hook para este evento específico
    useEffect(() => {
      const currentWs = wsRef.current;
      if (currentWs) {
        const originalOnMessage = currentWs.onmessage;
        currentWs.onmessage = (event) => {
          originalOnMessage?.call(currentWs, event);
          try {
            const data = JSON.parse(event.data);
            wrappedCallback(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        return () => {
          if (currentWs) {
            currentWs.onmessage = originalOnMessage;
          }
        };
      }
    }, [eventType, callback]);
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    send,
    disconnect,
    subscribe,
    isConnected: isConnectedRef.current,
    reconnectAttempts: reconnectAttemptsRef.current
  };
};