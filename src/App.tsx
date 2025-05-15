import { Routes, Route } from 'react-router-dom'
import { Club, Home, Join, Login, Mentor, MyPage, Project, RoadMap } from './Pages'
import './App.css'

const RouterItem = [
  { path: "/", element: <Home /> },
  { path: "/club", element: <Club/> },
  { path: "/projects", element: <Project/> },
  { path: "/learning", element: <RoadMap /> },
  { path: "/mentor", element: <Mentor/> },
  { path: "/login", element: <Login /> },
  { path: "/join", element: <Join /> },
  { path: "/mypage", element: <MyPage/>}
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
