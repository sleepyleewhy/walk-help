import { useEffect, useRef, useState } from "react";



const useCamera = (fps : number = 30) => {
    const [camera, setCamera] = useState<MediaStream | null>(null);
    const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
    const [imageAsBase64, setImageAsBase64] = useState<string>("");
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        const getCameraStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment',
                        width: { ideal: 640 },
                        height: { ideal: 640}
                    },
                });
                setCamera(stream);
            }catch (err) {
                console.error('Error accessing camera:', err);
            }
        };
        if (isCameraActive){
            getCameraStream();
        } else {
                setCamera(null);
        }

        return () => {
            if (camera) {
                camera.getTracks().forEach(track => {track.stop();});
            }

        }
    }, [isCameraActive, camera]);

    useEffect(() => {
        if (camera && videoRef.current && canvasRef.current) {
            videoRef.current.srcObject = camera;
        }

        const captureImage = () => {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            if (canvas && video){
                const ctx = canvas.getContext('2d');
                if (ctx){
                    ctx.drawImage(video, 0, 0, 640, 640);
                    setImageAsBase64(canvas.toDataURL('image/jpeg'));
                }
            }
        }

        const intervalId = setInterval(captureImage, 1000/ fps);

        return () => { clearInterval(intervalId); };

    }, [camera, fps]);
    
    return {isCameraActive, setIsCameraActive, imageAsBase64, videoRef, canvasRef};
}

export default useCamera;