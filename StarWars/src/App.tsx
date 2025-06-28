import { Routes, Route, Navigate } from 'react-router-dom'
import MoviesList from './pages/MoviesList'
import MovieDetail from './pages/MovieDetail'
import CharactersList from './pages/CharactersList'
import CharacterDetail from './pages/CharacterDetail'
import IntroWrapper from './components/IntroWrapper'

function App() {
  return (
    <>
    <IntroWrapper>
    <Routes>
      <Route path="/" element={<Navigate to="/movies" replace />} />
      <Route path="/movies" element={<MoviesList />} />
      <Route path="/movies/:id" element={< MovieDetail />} />
      <Route path="/characters" element={<CharactersList/>} />
      <Route path="/characters/:id/" element={<CharacterDetail/>} />
    </Routes>
    </IntroWrapper>
    </>
  )
}

export default App
