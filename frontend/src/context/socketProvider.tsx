import React, {  ReactNode } from "react";
import { socketContext } from "./socketContext";
import { io } from "socket.io-client";



type SocketProviderProps = {
    children: ReactNode;
};

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {

    const socket = io('http://127.0.0.1:8000', {
        path: '/sockets',
        transports: ['websocket'],
    });

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err}`);
    });
    socket.on('connect', () => {
        console.log('Connected to server');
    });

    return (
        <>
        
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
        </>
    );
};

export default SocketProvider;
