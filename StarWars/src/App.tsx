import './styles/global.scss'
import { Routes, Route, Navigate } from 'react-router-dom'
import MoviesList from './pages/MoviesList'
import MovieDetail from './pages/MovieDetail'
// import CharactersList from './pages/CharactersList'
// import CharacterDetail from'./pages/CharacterDetail'

function App() {
  console.log("App component is rendering"); 
  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/movies" replace />} />
      <Route path="/movies" element={<MoviesList />} />
      <Route path="/movies/:id" element={< MovieDetail />} />
      {/* <Route path="/characters" element={<CharactersList/>} />
      <Route path="/characters/:id/" element={<CharacterDetail/>} /> */}
    </Routes>
    </>
  )
}

export default App
