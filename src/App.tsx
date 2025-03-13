import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import Joc from './pages/Joc/Joc';
import viteLogo from '/vite.svg'
import './App.css'

useState;
reactLogo;
viteLogo;

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/joc' element={<Joc/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
