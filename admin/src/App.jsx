//import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './Dashboard'
import AddPost from './AddPost'
import EditPost from './EditPost'
import Login from './Login'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import Register from './Register'
import NewsletterList from './components/NewsletterList'

function NavBar() {
  const { logout } = useAuth()
  return (
    <nav className="p-4 bg-gray-100 flex justify-between items-center mb-6">
      <div className="flex gap-4">
        <Link to="/">Dashboard</Link>
        <Link to="/add">Add Post</Link>
      </div>
      <button 
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  )
}

function App() {
  //const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <>
                  <NavBar />
                  <Dashboard />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/add"
            element={
              <PrivateRoute>
                <>
                  <NavBar />
                  <AddPost />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <>
                  <NavBar />
                  <EditPost />
                </>
              </PrivateRoute>
            }
          />
          <Route path="/newsletter-signups" element={
            <PrivateRoute roles={['admin']}>
              <NewsletterList />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
