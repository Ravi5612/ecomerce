import { useState } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { backendUrl } from '../lib/config'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(backendUrl + '/api/user/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Password reset link sent to your email!')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      <form onSubmit={onSubmitHandler} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-5">
        <div className="text-center mb-2">
          <h2 className="text-3xl font-bold text-blue-700">Forgot Password</h2>
          <p className="text-gray-500">Enter your email to receive a password reset link.</p>
        </div>
        <input onChange={e => setEmail(e.target.value)} value={email} type="email" className="w-full px-3 py-2 border rounded" placeholder="Email" required />
        <button disabled={loading} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition">{loading ? 'Please wait...' : 'Send Link'}</button>
        <div className="text-right text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword