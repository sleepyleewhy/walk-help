import { SetStateAction, useEffect, useRef, useState } from "react";




const useWatchingDetection = (magnitude: number, isMagnitudeActive: boolean, setIsMagnitudeActive: React.Dispatch<SetStateAction<boolean>>,
    magnitudeThreshold: number, alertLevel: number, setAlertLevel: React.Dispatch<SetStateAction<number>>
) => {

    const [isWatchingDetectionActive, setIsWatchingDetectionActive] = useState<boolean>(false);
    const [magnitudeAverage, setMagnitudeAverage] = useState(0);
    const magnitudeHistory = useRef<number[]>([]);
    const historyLength = 100;

    useEffect(() => {
        if (isWatchingDetectionActive && isMagnitudeActive) {
            magnitudeHistory.current.push(magnitude);
            if (magnitudeHistory.current.length > historyLength) {
                magnitudeHistory.current.shift();
            }
            if (magnitudeHistory.current.length > 0) {
                setMagnitudeAverage(magnitudeHistory.current.reduce((sum, value) => sum + value, 0) / magnitudeHistory.current.length);
            }
            else {
                setMagnitudeAverage(0);
            }

        }

    }, [magnitude, isWatchingDetectionActive, isMagnitudeActive]);

    useEffect(() => {

    })

    useEffect(() => {
        if (alertLevel >= 0) {
            setIsWatchingDetectionActive(true);
            if (!isMagnitudeActive) {
                setIsMagnitudeActive(true);
            }
            if (magnitudeAverage < magnitudeThreshold) {

                if (alertLevel < 1) {
                    setAlertLevel(1);
                }
            }
            else {
                if (alertLevel >= 1) {
                    setAlertLevel(0);
                }
            }
        }
    }, [alertLevel, isMagnitudeActive, magnitudeThreshold, setAlertLevel, setIsMagnitudeActive, magnitudeAverage])




return isWatchingDetectionActive;
}


export default useWatchingDetection;