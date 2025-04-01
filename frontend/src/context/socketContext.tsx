import { createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";



export const socketContext = createContext<Socket>(io(import.meta.env.VITE_API_URL, {
    path: '/sockets',
    transports: ['websocket'],
    secure: true,
}));

export const useSocketContext = () => {
    const context = useContext(socketContext);
    if (!context) {
        throw new Error("usesSocketContext must be used within a socketProvider");
    }

    return context;
}