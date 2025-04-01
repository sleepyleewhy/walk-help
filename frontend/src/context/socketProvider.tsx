import React, {  ReactNode } from "react";
import { socketContext } from "./socketContext";
import { io } from "socket.io-client";



type SocketProviderProps = {
    children: ReactNode;
};

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {

    const socket = io('nothing', {
        path: '/sockets',
        transports: ['websocket'],
        secure: true,
    });

    socket.on("connect_error", (err) => {
        console.error("Connection error: ",'nothing', err.message);

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
