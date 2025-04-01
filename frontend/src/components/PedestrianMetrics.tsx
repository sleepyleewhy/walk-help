import { usePedestrianContext } from "../context/pedestrianContext";



const PedestrianMetrics: React.FC = () => {

    const context = usePedestrianContext();;


    return (
        <div>
            <h1 className="font-bold text-2xl">Pedestrian Metrics</h1>
            <p className="font-semibold text-xl">Alert Level: {context.alertLevel}</p>
            <div>
                <h3>Position</h3>
                <p>Longitude: {context.location?.longitude}</p>
                <p>Latitude: {context.location?.latitude}</p>
                <p>Accuracy: {context.location?.accuracy}</p>
                <p>Speed: {context.location?.speed}</p>
                <p>Timestamp: {context.location?.timestamp.toLocaleDateString()}</p>
                <p>Location is active: {context.isLocationActive ? 'Yes' : 'No'}</p>
                <button onClick={() => context.setIsLocationActive(!context.isLocationActive)}>Toggle</button>
                <h3>Sensors</h3>
                <p>Magnitude: {context.magnitude}</p>
                <p>Magnitude is active: {context.isMagnitudeActive ? 'Yes' : 'No'}</p>
                <button onClick={() => context.setIsMagnitudeActive(!context.isMagnitudeActive)}>Toggle</button>
                <p>Magnitude threshold: {context.magnitudeThreshold}</p>
                <p>Orientation: {context.orientation}</p>
                <p>Orientation is active: {context.isOrientationActive ? 'Yes' : 'No'}</p>
                <button onClick={() => context.setIsOrientationActive(!context.isOrientationActive)}>Toggle</button>
                <h3>Camera</h3>
                <p>Camera is active: {context.isCameraActive ? 'Yes' : 'No'}</p>
                <button onClick={() => context.setIsCameraActive(!context.isCameraActive)}>Toggle</button>
                {context.cameraImage && <img src={context.cameraImage} alt="Camera" />}
                
                <h3>Awareness</h3>
                <h3>Crosswalk</h3>
                <p>Crosswalk ID: {context.crosswalkId}</p>
            </div>
        </div>
    )


}

export default PedestrianMetrics;