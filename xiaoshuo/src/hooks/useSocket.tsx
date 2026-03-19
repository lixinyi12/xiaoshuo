import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client'
import { SOCKET_URL } from '../constants/socket';
import { Socket } from 'socket.io-client'

const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        socketRef.current = io(SOCKET_URL, {
            withCredentials: true
        })

        socketRef.current.on('connect', () => {
            console.log('socket已连接，id：', socketRef.current?.id);
            setIsConnected(true);
            setError(null);
        })

        socketRef.current.on('connect_error', (err) => {
            console.log('发生错误：', err.message);
            setIsConnected(false);
            setError(err);
        })

        socketRef.current.on('disconnect', (reason) => {
            console.log('断开连接，原因：', reason);
            setIsConnected(false);
            if (reason === 'io server disconnect') {
                socketRef.current?.connect();
            }
        })

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        }
    }, []);

    const emit = (event: string, data: any) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit(event, data);
        } else {
            console.log('socket未连接')
        }
    }

    return {
        socket: socketRef.current,
        isConnected,
        error,
        emit
    }
}

export default useSocket;