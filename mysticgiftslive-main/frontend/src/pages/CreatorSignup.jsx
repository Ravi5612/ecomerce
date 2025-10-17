import { useState } from 'react'
import { toast } from 'react-toastify'
import { backendUrl } from '../lib/config'
import { useNavigate } from 'react-router-dom'

const CreatorSignup = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', bio: '', socials: '', payoutEmail: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/api/user/creator-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Creator account created! Please log in.')
        navigate('/login')
      } else {
        toast.error(data.message)
      }
    } catch (e) {
      toast.error('Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      {/* Left: Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-5">
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Become a Content Creator</h2>
          <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="Full Name" required />
          <input name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="Email" required />
          <input name="password" value={form.password} onChange={handleChange} type="password" className="w-full px-3 py-2 border rounded" placeholder="Password" required />
          <input name="payoutEmail" value={form.payoutEmail} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="Payout Email (for affiliate earnings)" required />
          <input name="socials" value={form.socials} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="Social Links (comma separated)" />
          <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="Short Bio" />
          <button disabled={loading} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition">{loading ? 'Please wait...' : 'Sign Up as Creator'}</button>
        </form>
      </div>
      {/* Right: Info Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white/80">
        <div className="max-w-md">
          <h3 className="text-2xl font-bold text-blue-700 mb-4">Why Become a Creator?</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-3 mb-6">
            <li>Earn commissions on every sale made with your unique affiliate code.</li>
            <li>Grow your audience and brand with our platform’s reach.</li>
            <li>Access exclusive creator tools and analytics.</li>
            <li>Get paid directly to your payout email, fast and secure.</li>
            <li>Share your spiritual wisdom and inspire others.</li>
          </ul>
          <h4 className="text-lg font-semibold text-blue-600 mb-2">How It Works</h4>
          <ol className="list-decimal pl-5 text-gray-600 space-y-2">
            <li>Sign up as a creator and get your unique affiliate code.</li>
            <li>Share your code or link with your followers.</li>
            <li>Earn a commission every time someone uses your code at checkout.</li>
            <li>Track your sales, clicks, and earnings in your profile dashboard.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default CreatorSignup