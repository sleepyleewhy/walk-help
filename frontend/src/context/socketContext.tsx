import { createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";



export const socketContext = createContext<Socket>(io('http://127.0.0.1:8000', {
    path: '/sockets',
    transports: ['websocket'],
}));

export const useSocketContext = () => {
    const context = useContext(socketContext);
    if (!context) {
        throw new Error("usesSocketContext must be used within a socketProvider");
    }

    return context;
}