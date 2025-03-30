import React, {  ReactNode } from "react";
import { socketContext } from "./socketContext";
import { io } from "socket.io-client";



type SocketProviderProps = {
    children: ReactNode;
};

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {

    const socket = io(import.meta.env.VITE_API_URL, {
        path: '/sockets',
        transports: ['websocket'],
        secure: true,
    });

    socket.on("connect_error", (err) => {
        console.error("Connection error: ",import.meta.env.API_URL, err.message);

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
