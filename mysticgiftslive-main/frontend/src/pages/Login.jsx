import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

// ✅ ADD THIS LINE - Google Client ID from .env
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const Login = () => {
  const { token, setToken, navigate, backendUrl, role, setRole } = useContext(ShopContext);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(backendUrl + '/api/user/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success && data.accessToken) {
        setToken(data.accessToken);
        setRole(data.role);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('role', data.role);
        toast.success('Login successful!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED - Google Login handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send credential directly to backend (NOT decoded data)
      const res = await fetch(`${backendUrl}/api/user/google-auth`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();
      if (data.success && data.accessToken) {
        setToken(data.accessToken);
        setRole(data.role);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('role', data.role);
        toast.success(data.message || 'Logged in with Google!');
      } else {
        toast.error(data.message || 'Google login failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Google authentication failed.');
    }
  };

  const handleGoogleFailure = () => {
    toast.error('Google login was cancelled or failed.');
  };

  useEffect(() => {
    if (token) navigate('/');
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-5"
      >
        <div className="text-center mb-2">
          <h2 className="text-3xl font-bold text-blue-700">Sign In</h2>
          <p className="text-gray-500">Welcome back! Please login to your account.</p>
        </div>

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
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Please wait...' : 'Sign In'}
        </button>

        {/* OR Divider */}
        <div className="flex items-center gap-2 my-2">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* ✅ Google Sign In Button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
          />
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-500">New to MysticGifts?</span>
          <Link to="/signup" className="text-blue-600 hover:underline text-right">Sign Up</Link>
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-500">Forgot Password?</span>
          <Link to="/forgot-password" className="text-blue-600 hover:underline text-right">Reset it</Link>
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-500">Want to earn as a creator?</span>
          <Link to="/creator-signup" className="text-blue-600 hover:underline text-right">Join as Creator</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;