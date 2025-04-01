
import PedestrianMetrics from "../../components/PedestrianMetrics";
import PedestrianProvider from "../../context/pedestrianProvider";
import PedestrianCalibrationDrawer from "@/components/PedestrianCalibrationDrawer";
import StartPedestrianButton from "@/components/StartPedestrianButton";
const PedestrianPage: React.FC = () => {


    return (
        <PedestrianProvider>
            <h1 className="font-extrabold text-4xl mb-4">Pedestrian Mode</h1>
            <StartPedestrianButton/>
            <PedestrianCalibrationDrawer />
            <PedestrianMetrics />
        </PedestrianProvider>
    );
};

export default PedestrianPage;