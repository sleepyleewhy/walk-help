import { SetStateAction, useEffect, useRef, useState } from "react";




const useWatchingDetection = (magnitude : number, isMagnitudeActive : boolean, setIsMagnitudeActive : React.Dispatch<SetStateAction<boolean>>, 
    magnitudeThreshold: number, alertLevel: number, setAlertLevel: React.Dispatch<SetStateAction<number>>
) => {

    const [isWatchingDetectionActive, setIsWatchingDetectionActive] = useState<boolean>(false);
    const lowMagnitudeCounter = useRef(0);
    const highMagnitudeCounter = useRef(0);


    useEffect(() => {
        if (alertLevel >= 0){
            setIsWatchingDetectionActive(true);
            if (!isMagnitudeActive){
                setIsMagnitudeActive(true);
            }

            if (magnitude > magnitudeThreshold){
                lowMagnitudeCounter.current = 0;
                highMagnitudeCounter.current++;
                if (highMagnitudeCounter.current >= 10){
                    if (alertLevel === 0){
                        setAlertLevel(1);
                    }
                    highMagnitudeCounter.current = 0;
                }
            }
            else {
                highMagnitudeCounter.current = 0;
                lowMagnitudeCounter.current++;
                if (lowMagnitudeCounter.current >= 10){
                    if (alertLevel >= 1){
                        setAlertLevel(0);
                    }
                    lowMagnitudeCounter.current = 0;
                }
            }


        }
    }, [alertLevel, isMagnitudeActive, magnitude, magnitudeThreshold, setAlertLevel, setIsMagnitudeActive] )




    return isWatchingDetectionActive;
}


export default useWatchingDetection;