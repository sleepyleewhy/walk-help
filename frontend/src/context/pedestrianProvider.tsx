import React, { useState, ReactNode } from "react";
import { PedestrianContextType } from "../models/pedestrianContextType";

import { PedestrianContext } from "./pedestrianContext";
import useMagnitude from "../hooks/sensors/useMagnitude";
import useOrientation from "../hooks/sensors/useOrientation";
import useLocation from "../hooks/sensors/useLocation";
import useCamera from "../hooks/sensors/useCamera";
import useCrosswalkDetection from "../hooks/services/useCrosswalkDetection";
import { useSocketContext } from "./socketContext";
import useWatchingDetection from "../hooks/services/useWatchingDetection";
import useCrosswalkLocator from "@/hooks/services/useCrosswalkLocator";

type PedestrianProviderProps = {
    children: ReactNode;
};

const PedestrianProvider: React.FC<PedestrianProviderProps> = ({
    children,
}) => {
    const { magnitude, isMagnitudeActive, setIsMagnitudeActive } = useMagnitude();
    const [magnitudeThreshold, setMagnitudeThreshold] = useState<number>(0);
    const { orientation, isOrientationActive, setIsOrientationActive } =
        useOrientation();
    const {
        imageAsBase64,
        isCameraActive,
        setIsCameraActive,
        canvasRef,
        videoRef,
    } = useCamera();
    const [alertLevel, setAlertLevel] = useState<number>(-1);
    const { location, isLocationActive, setIsLocationActive } = useLocation(alertLevel);
    const [crosswalkId, setCrosswalkId] = useState(0);
    const socket = useSocketContext();
    const isCrosswalkDetectionActive = useCrosswalkDetection(
        socket,
        imageAsBase64,
        alertLevel,
        setAlertLevel,
        isCameraActive,
        setIsCameraActive
    );
    const isWatchingDetectionActive = useWatchingDetection(
        magnitude,
        isMagnitudeActive,
        setIsMagnitudeActive,
        magnitudeThreshold,
        alertLevel,
        setAlertLevel
    );

    const isCrosswalkLocatorActive = useCrosswalkLocator(location, alertLevel, setCrosswalkId, orientation)


    const contextValue: PedestrianContextType = {
        location,
        isLocationActive,
        setIsLocationActive,

        magnitude,
        isMagnitudeActive,
        setIsMagnitudeActive,

        magnitudeThreshold,
        setMagnitudeThreshold,

        orientation,
        isOrientationActive,
        setIsOrientationActive,

        cameraImage: imageAsBase64,
        isCameraActive,
        setIsCameraActive,

        alertLevel,
        setAlertLevel,

        crosswalkId,
        setCrosswalkId,

        isCrosswalkDetectionActive,
        isWatchingDetectionActive,
        isCrosswalkLocatorActive
    };

    return (
        <>
            <PedestrianContext.Provider value={contextValue}>
                {children}
            </PedestrianContext.Provider>
            <video ref={videoRef} autoPlay style={{ display: "none" }}></video>
            <canvas
                ref={canvasRef}
                style={{ display: "none" }}
                height={640}
                width={640}
            ></canvas>
        </>
    );
};

export default PedestrianProvider;
