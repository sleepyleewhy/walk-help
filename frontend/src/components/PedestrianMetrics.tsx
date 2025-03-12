import { useEffect } from "react";
import { usePedestrianContext } from "../context/pedestrianContext";



const PedestrianMetrics: React.FC = () => {

    const context = usePedestrianContext();

    useEffect(() => {
        context.setAlertLevel(2);
    }, [context]);


    return (
        <div>
            <h2>Pedestrian Metrics</h2>
            <div>
                <h3>Position</h3>
                <p>Longitude: {context.location.longitude}</p>
                <p>Latitude: {context.location.latitude}</p>
                <p>Accuracy: {context.location.accuracy}</p>
                <h3>Sensors</h3>
                <p>Magnitude: {context.magnitude}</p>
                <p>Magnitude threshold: {context.magnitudeThreshold}</p>
                <p>Orientation: {context.orientation}</p>
                <h3>Camera</h3>
                <img src={context.cameraImage} alt="Camera" />
                <h3>Awareness</h3>
                <p>Alert Level: {context.alertLevel}</p>
                <p>Unaware: {context.unaware ? "Yes" : "No"}</p>
                <h3>Crosswalk</h3>
                <p>Crosswalk ID: {context.crosswalkId}</p>
            </div>
        </div>
    )


}

export default PedestrianMetrics;