import { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../lib/config'
import { toast } from 'react-toastify'

const AdminSetup = ({ onSetupComplete }) => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', password: '', code: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSetup = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(backendUrl + '/api/admin/setup', form)
      if (res.data.success) {
        toast.success(res.data.message)
        setStep(2)
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      toast.error('Setup failed')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(backendUrl + '/api/admin/verify', { email: form.email, code: form.code })
      if (res.data.success) {
        toast.success(res.data.message)
        onSetupComplete()
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      toast.error('Verification failed')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        {step === 1 ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Admin Setup</h1>
            <form onSubmit={handleSetup}>
              <input name="name" onChange={handleChange} value={form.name} className="mb-3 w-full px-3 py-2 border rounded" placeholder="Name" required />
              <input name="email" onChange={handleChange} value={form.email} className="mb-3 w-full px-3 py-2 border rounded" type="email" placeholder="Email" required />
              <input name="password" onChange={handleChange} value={form.password} className="mb-3 w-full px-3 py-2 border rounded" type="password" placeholder="Password" required />
              <button className="w-full py-2 px-4 rounded text-white bg-blue-600" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Admin'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Verify Email</h1>
            <form onSubmit={handleVerify}>
              <input name="code" onChange={handleChange} value={form.code} className="mb-3 w-full px-3 py-2 border rounded" placeholder="Verification Code" required />
              <button className="w-full py-2 px-4 rounded text-white bg-green-600" type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminSetup