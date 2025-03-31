
import { Location } from "./location"
import { Dispatch, SetStateAction } from "react";

export type PedestrianContextType = {
    location: Location | null,
    isLocationActive: boolean,
    setIsLocationActive: Dispatch<SetStateAction<boolean>>,

    magnitude: number,
    isMagnitudeActive: boolean,
    setIsMagnitudeActive: Dispatch<SetStateAction<boolean>>,

    magnitudeThreshold: number,
    setMagnitudeThreshold: Dispatch<SetStateAction<number>>,

    orientation: number,
    isOrientationActive: boolean,
    setIsOrientationActive: Dispatch<SetStateAction<boolean>>,

    isCameraActive: boolean,
    setIsCameraActive: Dispatch<SetStateAction<boolean>>,
    cameraImage: string,

    alertLevel: number,
    setAlertLevel: Dispatch<SetStateAction<number>>,
    
    crosswalkId: number,
    setCrosswalkId: Dispatch<SetStateAction<number>>

    isCrosswalkDetectionActive: boolean,
    isWatchingDetectionActive: boolean,
    isCrosswalkLocatorActive: boolean
}