import { createContext, useContext } from "react";
import { PedestrianContextType } from "../models/pedestrianContextType";
import { Location } from "../models/location";

const defaultLocation: Location = {
    longitude : 0,
    latitude : 0,
    accuracy: 0,
    speed: 0,
    timestamp: new Date()
}

const defaultContext: PedestrianContextType = {
    location: defaultLocation,
    isLocationActive: false,
    setIsLocationActive: () => {},
    magnitude: 0,
    isMagnitudeActive: false,
    setIsMagnitudeActive: () => {},
    magnitudeThreshold: 0,
    setMagnitudeThreshold: () => {},
    orientation: 0,
    isOrientationActive: false,
    setIsOrientationActive: () => {},
    cameraImage: "",
    isCameraActive: false,
    setIsCameraActive: () => {},
    alertLevel: 0,
    setAlertLevel: () => {},
    unaware: false,
    setUnaware: () => {},
    crosswalkId: 0,
    setCrosswalkId: () => {},
    isCrosswalkDetectionActive: false,
}


export const PedestrianContext = createContext<PedestrianContextType>(defaultContext);

export const usePedestrianContext = () => {
    const context = useContext(PedestrianContext);
    if (!context) {
        throw new Error("usePedestrianContext must be used within a PedestrianProvider");
    }

    return context;
}