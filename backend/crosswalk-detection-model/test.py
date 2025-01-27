from ultralytics import YOLO

# Load a pretrained YOLO11n model
model = YOLO("best.pt")

# Run inference on 'bus.jpg' with arguments
model.predict("videoplayback.mp4", imgsz=640,show=True )