import socketio
from prediction import predictImageIsCrosswalk


sio_server = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
sio_app = socketio.ASGIApp(socketio_server=sio_server, socketio_path='sockets')


@sio_server.event
async def connect(sid, environ, auth):
    print(f'{sid}: connected')
    
    
@sio_server.event
async def predict(sid, username, imageAsBase64):  
    await sio_server.emit('predict_result_'+ username, predictImageIsCrosswalk(imageAsBase64))