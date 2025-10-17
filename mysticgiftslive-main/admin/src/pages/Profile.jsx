import { useState, useEffect } from 'react'
import { useAdminAuth } from '../lib/AdminAuthContext'
import axios from 'axios'
import { backendUrl } from '../lib/config'
import { toast } from 'react-toastify'

const Profile = () => {
  const { accessToken, admin, setAdmin } = useAdminAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Fetch admin profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await axios.get(
          backendUrl + '/api/admin/me',
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        if (res.data.success) {
          setName(res.data.admin.name)
          setEmail(res.data.admin.email)
          setAdmin && setAdmin(res.data.admin)
        } else {
          toast.error(res.data.message)
        }
      } catch (err) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [accessToken])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation: Check if fields are filled when changing password
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        toast.error('Please enter current password')
        return
      }
      if (!newPassword) {
        toast.error('Please enter new password')
        return
      }
      if (!confirmPassword) {
        toast.error('Please confirm new password')
        return
      }
      if (newPassword !== confirmPassword) {
        toast.error('New password and confirm password do not match')
        return
      }
    }

    setLoading(true)
    try {
      const res = await axios.post(
        backendUrl + '/api/admin/update',
        {
          name,
          email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (res.data.success) {
        setAdmin && setAdmin(res.data.admin)
        toast.success('Profile updated!')
        setNewPassword('')
        setConfirmPassword('')
        setCurrentPassword('')
        setIsEditMode(false)
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      toast.error('Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditMode(false)
    setNewPassword('')
    setConfirmPassword('')
    setCurrentPassword('')
  }

  // Eye icon components
  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )

  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-8 mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Account Settings</h1>
      
      {!isEditMode ? (
        // View Mode - Only show details
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Name</label>
            <p className="w-full px-3 py-2 border rounded bg-gray-50 text-gray-800">{name}</p>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Email</label>
            <p className="w-full px-3 py-2 border rounded bg-gray-50 text-gray-800">{email}</p>
          </div>
          <button
            onClick={() => setIsEditMode(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        // Edit Mode - Show form
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-blue-400"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={loading}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-blue-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              required
              disabled={loading}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Current Password</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-blue-400"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              type="password"
              placeholder="Enter current password"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">New Password</label>
            <div className="relative">
              <input
                className="w-full px-3 py-2 border rounded focus:outline-blue-400 pr-10"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Confirm Password</label>
            <div className="relative">
              <input
                className="w-full px-3 py-2 border rounded focus:outline-blue-400 pr-10"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded font-semibold hover:bg-gray-600 transition"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Profile