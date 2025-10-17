import { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const Signup = () => {
  const { token, setToken, navigate, backendUrl, role, setRole } = useContext(ShopContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(backendUrl + '/api/user/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await response.json()
      if (data.success && data.accessToken) {
        setToken(data.accessToken)
        setRole(data.role)
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('role', data.role)
        toast.success('Signup successful!')
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true)
      const response = await fetch(backendUrl + '/api/user/google-auth', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          credential: credentialResponse.credential 
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.accessToken) {
        setToken(data.accessToken)
        setRole(data.role)
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('role', data.role)
        toast.success(data.isNewUser ? 'Account created successfully!' : 'Login successful!')
        navigate('/')
      } else {
        toast.error(data.message || 'Google authentication failed')
      }
    } catch (error) {
      console.error('Google auth error:', error)
      toast.error('Google authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    toast.error('Google sign-in was cancelled or failed')
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-5">
          <div className="text-center mb-2">
            <h2 className="text-3xl font-bold text-blue-700">Create Account</h2>
            <p className="text-gray-500">Join MysticGifts and start your spiritual journey.</p>
          </div>

          {/* Google Sign-In Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              text="signup_with"
              shape="rectangular"
              width="100%"
            />
          </div>

          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
            <input 
              onChange={e => setName(e.target.value)} 
              value={name} 
              type="text" 
              className="w-full px-3 py-2 border rounded" 
              placeholder="Full Name" 
              required 
            />
            <input 
              onChange={e => setEmail(e.target.value)} 
              value={email} 
              type="email" 
              className="w-full px-3 py-2 border rounded" 
              placeholder="Email" 
              required 
            />
            <input 
              onChange={e => setPassword(e.target.value)} 
              value={password} 
              type="password" 
              className="w-full px-3 py-2 border rounded" 
              placeholder="Password" 
              required 
            />
            <button 
              disabled={loading} 
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400"
            >
              {loading ? 'Please wait...' : 'Sign Up'}
            </button>
          </form>

          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">Already have an account?</span>
            <Link to="/login" className="text-blue-600 hover:underline text-right">Sign In</Link>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Want to earn as a creator?</span>
            <Link to="/creator-signup" className="text-blue-600 hover:underline text-right">Join as Creator</Link>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default Signup