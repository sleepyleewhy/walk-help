
import './App.css'
import Accelerometer from './Accelerometer'
import CrosswalkDetection from './CrosswalkDetection'
import { useState } from 'react'
import { io } from 'socket.io-client'

function App() {
  const [isCurrWatching, setIsCurrWatching] = useState(false)

  const socket = io('http://127.0.0.1:8000', {
    path: '/sockets',
    transports: ['websocket'],
  });
  return (
    <>
      <div>
        <Accelerometer isCurrWatching={isCurrWatching} setIsCurrWatching={setIsCurrWatching}/>
        <CrosswalkDetection isWatching={isCurrWatching} socket={socket}/>
      </div>
    </>
  )
}

export default App
