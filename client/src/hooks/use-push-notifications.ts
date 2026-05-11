import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './use-websocket';

interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  url?: string;
  data?: any;
}

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // WebSocket para sincronización en tiempo real
  const { send: wsSend, subscribe: wsSubscribe } = useWebSocket({
    onMessage: (data) => {
      if (data.type === 'REAL_TIME_UPDATE') {
        handleRealTimeUpdate(data);
      }
    }
  });

  useEffect(() => {
    // Verificar soporte para notificaciones push
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }

    // Registrar service worker si no está registrado
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registrado:', registration);

          // Verificar si ya está suscrito
          return registration.pushManager.getSubscription();
        })
        .then((subscription) => {
          setIsSubscribed(!!subscription);
        })
        .catch((error) => {
          console.error('❌ Error registrando Service Worker:', error);
        });
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      throw new Error('Notificaciones push no soportadas en este navegador');
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      await subscribeToNotifications();
    }

    return result;
  }, [isSupported]);

  const subscribeToNotifications = useCallback(async () => {
    if (!isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          // Esta clave debería venir del servidor en producción
          'BYourVAPIDPublicKeyHere'
        )
      });

      // Enviar la suscripción al servidor
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON()
        }),
        credentials: 'include'
      });

      setIsSubscribed(true);
      console.log('✅ Suscrito a notificaciones push');
    } catch (error) {
      console.error('❌ Error suscribiéndose a notificaciones:', error);
    }
  }, [isSupported]);

  const unsubscribeFromNotifications = useCallback(async () => {
    if (!isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Notificar al servidor
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          }),
          credentials: 'include'
        });

        setIsSubscribed(false);
        console.log('✅ Desuscrito de notificaciones push');
      }
    } catch (error) {
      console.error('❌ Error desuscribiéndose:', error);
    }
  }, [isSupported]);

  const sendNotification = useCallback(async (options: PushNotificationOptions) => {
    if (permission !== 'granted') {
      throw new Error('Permiso de notificaciones no concedido');
    }

    // Para desarrollo local, usar notificaciones del navegador
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;

      await registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192x192.png',
        badge: options.badge || '/icon-192x192.png',
        tag: options.tag || 'davivienda-notification',
        data: options.data || {},
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'Ver'
          },
          {
            action: 'dismiss',
            title: 'Descartar'
          }
        ]
      });
    }
  }, [permission]);

  const handleRealTimeUpdate = useCallback((data: any) => {
    console.log('🔄 Actualización en tiempo real recibida:', data);

    // Manejar diferentes tipos de actualizaciones
    switch (data.eventType) {
      case 'BALANCE_UPDATE':
        // Actualizar saldo en la UI
        window.dispatchEvent(new CustomEvent('balanceUpdate', { detail: data }));
        break;

      case 'TRANSACTION_NEW':
        // Nueva transacción
        window.dispatchEvent(new CustomEvent('newTransaction', { detail: data }));
        // Mostrar notificación
        sendNotification({
          title: 'Nueva Transacción',
          body: `Transacción de ${data.amount} ${data.currency} realizada`,
          tag: 'transaction',
          data: data
        });
        break;

      case 'PAYMENT_DUE':
        // Pago pendiente
        sendNotification({
          title: 'Pago Pendiente',
          body: `Tiene un pago pendiente de ${data.service}`,
          tag: 'payment',
          data: data
        });
        break;

      case 'ACCOUNT_ALERT':
        // Alerta de cuenta
        sendNotification({
          title: 'Alerta de Cuenta',
          body: data.message,
          tag: 'alert',
          data: data
        });
        break;

      default:
        console.log('Tipo de evento no reconocido:', data.eventType);
    }
  }, [sendNotification]);

  // Escuchar eventos del service worker
  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
        console.log('🔄 Nueva versión disponible');
        // Aquí podrías mostrar un banner para actualizar la app
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, []);

  return {
    isSupported,
    isSubscribed,
    permission,
    requestPermission,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    sendNotification,
    wsSend,
    wsSubscribe
  };
};

// Utilidad para convertir VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}