
import { Location } from "./location"
import { Dispatch, SetStateAction } from "react";

export type PedestrianContextType = {
    location: Location,
    setLocation: Dispatch<SetStateAction<Location>>,

    magnitude: number,
    setMagnitude: Dispatch<SetStateAction<number>>,

    magnitudeThreshold: number,
    setMagnitudeThreshold: Dispatch<SetStateAction<number>>,

    orientation: number,
    setOrientation: Dispatch<SetStateAction<number>>,

    cameraImage: Base64URLString,
    setCameraImage: Dispatch<SetStateAction<Base64URLString>>,

    alertLevel: number,
    setAlertLevel: Dispatch<SetStateAction<number>>,

    unaware: boolean,
    setUnaware: Dispatch<SetStateAction<boolean>>,
    
    crosswalkId: number,
    setCrosswalkId: Dispatch<SetStateAction<number>>
}