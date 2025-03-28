import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";


const Home : React.FC = () => {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Home Page</h1>
            <Button onClick={() => navigate('/pedestrian')}>Pedestrian Page</Button>
        </div>
    )
}

export default Home;