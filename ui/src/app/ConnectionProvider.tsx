import React from 'react';
import { Socket, io } from 'socket.io-client';
import { notifications } from '@mantine/notifications';

const connect = () =>
  new Promise<Socket>((resolve, reject) => {
    const socket = io('http://localhost:9000', { transports: ['websocket'] });

    socket.on('connect', () => {
      notifications.hide('connection-error');
      return resolve(socket);
    });

    socket.on('disconnect', () => {
      notifications.show({
        id: 'connection-error',
        color: 'red',
        title: 'Connection error',
        message: 'Connection was lost',
        loading: true,
        autoClose: false,
      });
    });

    socket.on('exception', (error: Error) => notifications.show({ color: 'red', message: error.message }));

    socket.on('connect_error', e => {
      notifications.show({
        id: 'connection-error',
        color: 'red',
        title: 'Connection error',
        message: e.message === 'websocket error' ? 'Connection cannot be established' : e.message,
        loading: true,
        autoClose: false,
      });
      return reject(e);
    });
  });

const ConnectionContext = React.createContext<Socket | undefined>(undefined);

export const ConnectionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = React.useState<Socket>();

  React.useEffect(() => {
    let socket: Socket;
    connect().then(s => {
      socket = s;
      setSocket(s);
    });
    return () => {
      socket?.disconnect();
    };
  }, []);

  return <ConnectionContext.Provider value={socket}>{children}</ConnectionContext.Provider>;
};

export const useConnection = () => React.useContext(ConnectionContext);
