import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = (isAdmin) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (isAdmin) {
            const newSocket = io(SOCKET_URL);
            newSocket.emit('join_admin_room'); // Join the admin room
            setSocket(newSocket);

            return () => newSocket.close(); // Cleanup on unmount
        }
    }, [isAdmin]);

    return socket;
};