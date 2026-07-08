import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Profile from './pages/Profile.jsx'
import Notfound from './pages/404.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'
import Verification from './pages/Verification.jsx'
import Tournament_join from './pages/Tournament_join.jsx'
import Tournaments from './pages/Tournaments.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Blog from './pages/Blog.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/signup/verification/:id" element={<Verification />} />
        <Route path="/join/:id" element={<Tournament_join />} />
        <Route path="*" element={<Notfound />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
