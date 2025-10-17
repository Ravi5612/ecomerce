import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Messages from './pages/Contact'
import Login from './components/Login'
import Welcome from './pages/Welcome'
import Profile from './pages/Profile'
import Categories from './pages/Categories'
import AdminSetup from './pages/AdminSetup'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAdminAuth } from './lib/AdminAuthContext'
import axios from 'axios'
import { backendUrl } from './lib/config'
import Subscribers from './pages/Subscribers'
import AdminBlogCreate from './pages/AdminBlogCreate'
import AdminBlogList from './pages/AdminBlogList'
import Creators from './pages/Creators'

export const currency = '$'

const App = () => {
  const { accessToken, logout, loading } = useAdminAuth()
  const [setupNeeded, setSetupNeeded] = useState(undefined)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!accessToken) {
      axios.get(backendUrl + '/api/admin/setup-needed')
        .then(res => setSetupNeeded(res.data.setupNeeded))
        .catch(() => setSetupNeeded(false));
    }
  }, [accessToken, location.pathname])

  useEffect(() => {
    // Wait for loading to finish before redirecting
    if (!accessToken && setupNeeded === false && location.pathname !== '/login' && !loading) {
      navigate('/login')
    }
  }, [accessToken, setupNeeded, location.pathname, navigate, loading])

  // Block rendering until loading is done
  if ((setupNeeded === undefined && !accessToken) || loading) {
    return null;
  }

  if (setupNeeded && !accessToken) {
    return <AdminSetup onSetupComplete={() => setSetupNeeded(false)} />
  }

  // Only show Navbar/Sidebar if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {accessToken && <Navbar onLogout={logout} />}
      <hr />
      <div className="flex w-full">
        {accessToken && <Sidebar />}
        <main className={`flex-1 px-2 sm:px-4 md:px-8 my-8 text-gray-600 text-base h-auto transition-all duration-200 ${accessToken ? 'ml-[60px] md:ml-[180px]' : ''} overflow-hidden`}>
          <div className="w-full max-w-full">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={accessToken ? <Welcome /> : <Login />} />
              <Route path="/profile" element={accessToken ? <Profile /> : <Login />} />
              <Route path='/add' element={accessToken ? <Add /> : <Login />} />
              <Route path='/list' element={accessToken ? <List /> : <Login />} />
              <Route path='/orders' element={accessToken ? <Orders /> : <Login />} />
              <Route path='/messages' element={accessToken ? <Messages /> : <Login />} />
              <Route path='/categories' element={accessToken ? <Categories /> : <Login />} />
              <Route path='/subscribers' element={accessToken ? <Subscribers token={accessToken} /> : <Login />} />
              <Route path='/blog/create' element={accessToken ? <AdminBlogCreate /> : <Login />} />
              <Route path="/admin/blogs" element={accessToken ? <AdminBlogList /> : <Login />} />
              <Route path="/admin/creators" element={accessToken ? <Creators /> : <Login />} />
            </Routes>
          </div>
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="!z-[9999]"
      />
    </div>
  )
}

export default App