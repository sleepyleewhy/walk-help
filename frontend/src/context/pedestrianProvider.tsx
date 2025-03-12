import React, { useState, ReactNode } from "react";
import { PedestrianContextType } from "../models/pedestrianContextType";

import { PedestrianContext } from "./pedestrianContext";
import useMagnitude from "../hooks/useMagnitude";
import useOrientation from "../hooks/useOrientation";
import useLocation from "../hooks/useLocation";

type PedestrianProviderProps = {
    children: ReactNode;
};

const PedestrianProvider: React.FC<PedestrianProviderProps> = ({ children }) => {
    const {location, isLocationActive, setIsLocationActive} = useLocation();
    const { magnitude, isMagnitudeActive , setIsMagnitudeActive } = useMagnitude();
    const [magnitudeThreshold, setMagnitudeThreshold] = useState<number>(0);
    const { orientation, isOrientationActive, setIsOrientationActive } = useOrientation();
    const [cameraImage, setCameraImage] = useState<string>("");
    const [alertLevel, setAlertLevel] = useState<number>(0);
    const [unaware, setUnaware] = useState<boolean>(false);
    const [crosswalkId, setCrosswalkId] = useState<number>(0);

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

        cameraImage,
        setCameraImage,

        alertLevel,
        setAlertLevel,

        unaware,
        setUnaware,

        crosswalkId,
        setCrosswalkId
    };

    return (
        <PedestrianContext.Provider value={contextValue}>
            {children}
        </PedestrianContext.Provider>
    );
};

export default PedestrianProvider;
