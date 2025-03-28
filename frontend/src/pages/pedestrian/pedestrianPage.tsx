
import PedestrianMetrics from "../../components/PedestrianMetrics";
import PedestrianProvider from "../../context/pedestrianProvider";
import PedestrianCalibrationDrawer from "@/components/PedestrianCalibrationDrawer";

const PedestrianPage : React.FC = () => {

    return (
        <PedestrianProvider>
            <div>
                <h1 className="text-4xl font-extrabold mb-4">Pedestrian Page</h1>
            </div>
            <PedestrianCalibrationDrawer/>
            <PedestrianMetrics/>
        </PedestrianProvider>
    )
}

export default PedestrianPage;