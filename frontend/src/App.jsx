import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Posts from './pages/Posts'
import PostDetail from './pages/PostDetail'
import CreatePost from './pages/CreatePost'
import Profile from './pages/Profile'
import LandingPage from './pages/LandingPage'

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth()
    return token ? children : <Navigate to="/login" />
}

function App() {
    const location = useLocation()

    return (
        <>
            {!["/", "/login", "/register", "/posts/create"].includes(location.pathname) && <Navbar />}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route
                    path="/posts/create"
                    element={
                        <ProtectedRoute>
                            <CreatePost />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    )
}

export default App