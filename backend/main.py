from fastapi import FastAPI
import base64
from ultralytics import YOLO
import numpy as np
import cv2
from fastapi.middleware.cors import CORSMiddleware

from sockets import sio_app


def base64_to_image(base64_string):
    img_bytes = base64.b64decode(base64_string)
    img_array = np.frombuffer(img_bytes, dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    print(img)
    return img


app = FastAPI()
app.add_middleware(CORSMiddleware,
                allow_origins=["*"],
                allow_credentials=True,
                allow_methods=["*"],
                allow_headers=["*"])
app.mount('/', app=sio_app)

model = YOLO("./crosswalk-detection-model/best.pt")

