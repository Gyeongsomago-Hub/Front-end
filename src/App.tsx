import { Routes, Route } from 'react-router-dom'
import { Home, Join, Login, RoadMap } from './Pages'
import { Navbar } from './Components'
import style from './App.module.css'
import Club from './Pages/Club/Index'

const RouterItem = [
  { path: "/", element: <Home /> },
  { path: "/community", element: <div>community</div> },
  { path: "/club", element: <Club/> },
  { path: "/projects", element: <div>project</div> },
  { path: "/learning", element: <RoadMap /> },
  { path: "/login", element: <Login /> },
  { path: "/join", element: <Join /> }
]

function App() {
  return (
    <Routes>
      {RouterItem.map((item, index) => (
        <Route
          key={index}
          path={item.path}
          element={item.element}
        />
      ))}
    </Routes>
  )
}

export default App
