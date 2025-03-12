import { createContext, useContext } from "react";
import { PedestrianContextType } from "../models/pedestrianContextType";
import { Location } from "../models/location";

const defaultLocation: Location = {
    longitude : 0,
    latitude : 0,
    accuracy: 0
}

const defaultContext: PedestrianContextType = {
    location: defaultLocation,
    setLocation: () => {},
    magnitude: 0,
    setMagnitude: () => {},
    magnitudeThreshold: 0,
    setMagnitudeThreshold: () => {},
    orientation: 0,
    setOrientation: () => {},
    cameraImage: "",
    setCameraImage: () => {},
    alertLevel: 0,
    setAlertLevel: () => {},
    unaware: false,
    setUnaware: () => {},
    crosswalkId: 0,
    setCrosswalkId: () => {}
}


export const PedestrianContext = createContext<PedestrianContextType>(defaultContext);

export const usePedestrianContext = () => {
    const context = useContext(PedestrianContext);
    if (!context) {
        throw new Error("usePedestrianContext must be used within a PedestrianProvider");
    }

    return context;
}