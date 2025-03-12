import React, { useState, ReactNode } from "react";
import { PedestrianContextType } from "../models/pedestrianContextType";

import { PedestrianContext } from "./pedestrianContext";
import { Location } from "../models/location";

type PedestrianProviderProps = {
    children: ReactNode;
};

const PedestrianProvider: React.FC<PedestrianProviderProps> = ({ children }) => {
    const [location, setLocation] = useState<Location>({ longitude: 0, latitude: 0, accuracy: 0 });
    const [magnitude, setMagnitude] = useState<number>(0);
    const [magnitudeThreshold, setMagnitudeThreshold] = useState<number>(0);
    const [orientation, setOrientation] = useState<number>(0);
    const [cameraImage, setCameraImage] = useState<string>("");
    const [alertLevel, setAlertLevel] = useState<number>(0);
    const [unaware, setUnaware] = useState<boolean>(false);
    const [crosswalkId, setCrosswalkId] = useState<number>(0);

    const contextValue: PedestrianContextType = {
        location,
        setLocation,

        magnitude,
        setMagnitude,

        magnitudeThreshold,
        setMagnitudeThreshold,

        orientation,
        setOrientation,

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
