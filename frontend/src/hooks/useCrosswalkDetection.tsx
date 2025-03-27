import React, { SetStateAction, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";



const useCrosswalkDetection = (socket: Socket, imageAsBase64: string, alertLevel: number, setAlertLevel: React.Dispatch<SetStateAction<number>>, 
    isCameraActive: boolean, setIsCameraActive: React.Dispatch<SetStateAction<boolean>>) => {


    const isCrosswalkDetectionActive = alertLevel >= 1;
    const noCrosswalkCounter = useRef(0);
    const username = localStorage.getItem("username");
    const intervalId = useRef(-1);
    useEffect(() => {

        if (alertLevel >= 1) {
            if (!isCameraActive) {
                setIsCameraActive(true);
            }
            socket.on("predict_result_" + username, (data) => {
                if (data === true) {
                    noCrosswalkCounter.current = 0;
                    if (alertLevel === 1) {
                        setAlertLevel(2);
                    }
                }
                else {
                    if (noCrosswalkCounter.current >= 10) {
                        setAlertLevel(1);
                        noCrosswalkCounter.current = 0;
                    }
                    else {
                        noCrosswalkCounter.current++;
                    }
                }
            });
            intervalId.current = setInterval(() => {
                socket.emit("predict", username, imageAsBase64);
            }, 100);
        }
        else {
            if (isCameraActive) {
                setIsCameraActive(false);
            }
            socket.off("predict_result_" + username);
            clearInterval(intervalId.current);
        }


    }, [alertLevel, imageAsBase64, socket, setAlertLevel, username, isCameraActive, setIsCameraActive]);
    return isCrosswalkDetectionActive




}

export default useCrosswalkDetection;