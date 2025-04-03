import {Routes, Route, useNavigate} from 'react-router-dom'
import { useEffect } from 'react'
import { Home, Join, Login } from './Pages'

function App() {
  return (
    <Routes>
      <Route index element={<Home/>} />
      <Route path='/Login' element={<Login/>} />
      <Route path='/join' element={<Join/>} />
    </Routes>
  )
}

export default App
