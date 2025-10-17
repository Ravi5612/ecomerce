import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import { backendUrl } from '../lib/config'
import SimpleBanner from '../components/Blog/SimpleBanner'

const Profile = () => {
  const { token, navigate } = useContext(ShopContext)
  const [user, setUser] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    // Fetch user info
    const fetchUser = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/user/me`, {
          headers: { token },
          credentials: 'include'
        })
        const data = await res.json()
        if (data.success) {
          setUser(data.user)
          setForm({
            name: data.user.name,
            email: data.user.email
          })
        }
      } catch (e) {
        toast.error('Failed to load profile')
      }
    }
    fetchUser()
  }, [token, navigate])

  const handleEdit = () => setEditMode(true)
  const handleCancel = () => {
    setEditMode(false)
    setForm({
      name: user.name,
      email: user.email
    })
  }
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/api/user/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token },
        credentials: 'include',
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        setUser(data.user)
        setEditMode(false)
        toast.success('Profile updated!')
      } else {
        toast.error(data.message)
      }
    } catch (e) {
      toast.error('Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>

  return (
    <div className="px-4 py-20 sm:px-6 lg:px-16 w-full">
      {/* Banner Section */}
      <div className="mb-8">
        <SimpleBanner
          title="My Profile"
          description="View and update your personal details."
        />
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-xl">
          {!editMode ? (
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
              <div>
                <label className="font-semibold block mb-1">Name</label>
                <div className="border rounded px-3 py-2 bg-gray-100 text-gray-700">{user.name}</div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Email</label>
                <div className="border rounded px-3 py-2 bg-gray-100 text-gray-700">{user.email}</div>
              </div>
              <button type="button" onClick={handleEdit} className="bg-blue-600 text-white px-4 py-2 rounded mt-4 self-end">
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
              <div>
                <label className="font-semibold block mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                  disabled={loading}
                  required
                />
              </div>
              <div className="flex gap-3 mt-4 justify-end">
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={handleCancel} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile