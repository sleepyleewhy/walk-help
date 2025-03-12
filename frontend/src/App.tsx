
import Accelerometer from './components/Accelerometer'
import './App.css'
// import CrosswalkDetection from './CrosswalkDetection'
import { useState } from 'react'
// import { io } from 'socket.io-client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const [isCurrWatching, setIsCurrWatching] = useState(false)

  // const socket = io('http://127.0.0.1:8000', {
  //   path: '/sockets',
  //   transports: ['websocket'],
  // });
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accelerometer isCurrWatching={isCurrWatching} setIsCurrWatching={setIsCurrWatching} />} />
      </Routes>
    </BrowserRouter>

    // <>
    //   <div>
    //     <Accelerometer isCurrWatching={isCurrWatching} setIsCurrWatching={setIsCurrWatching}/>
    //     <CrosswalkDetection isWatching={isCurrWatching} socket={socket}/>
    //   </div>
    // </>
  )
}

export default App
