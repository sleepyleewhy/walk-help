import PedestrianMetrics from "../../components/PedestrianMetrics";
import PedestrianProvider from "../../context/pedestrianProvider";

const PedestrianPage : React.FC = () => {

    return (
        <PedestrianProvider>
            <div>
                <h1>Pedestrian Page</h1>
            </div>
            <PedestrianMetrics/>
        </PedestrianProvider>
    )
}

export default PedestrianPage;