import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import { backendUrl } from '../lib/config'
import SimpleBanner from '../components/Blog/SimpleBanner'

const CreatorProfile = () => {
  const { token, navigate } = useContext(ShopContext)
  const [creator, setCreator] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', bio: '', socials: '', payoutEmail: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    const fetchCreator = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/user/creator/me`, {
          headers: { token },
          credentials: 'include'
        })
        const data = await res.json()
        if (data.success) {
          setCreator(data.creator)
          setForm({
            name: data.creator.name,
            email: data.creator.email,
            bio: data.creator.bio,
            socials: data.creator.socials,
            payoutEmail: data.creator.payoutEmail
          })
        }
      } catch (e) {
        toast.error('Failed to load profile')
      }
    }
    fetchCreator()
  }, [token, navigate])

  const handleEdit = () => setEditMode(true)
  const handleCancel = () => {
    setEditMode(false)
    setForm({
      name: creator.name,
      email: creator.email,
      bio: creator.bio,
      socials: creator.socials,
      payoutEmail: creator.payoutEmail
    })
  }
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/api/user/creator/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token },
        credentials: 'include',
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        setCreator(data.creator)
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

  const handleCopy = () => {
    navigator.clipboard.writeText(creator.affiliateCode)
    toast.success('Affiliate code copied!')
  }

  if (!creator) return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>

  return (
    <div className="px-4 py-20 sm:px-6 lg:px-16 w-full">
      <div className="mb-8">
        <SimpleBanner
          title="Creator Profile"
          description="View and update your creator details, bio, and payout information."
        />
      </div>
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <div className="w-full max-w-xl">
          {!editMode ? (
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
              <div>
                <label className="font-semibold block mb-1">Name</label>
                <div className="border rounded px-3 py-2 bg-gray-100 text-gray-700">{creator.name}</div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Email</label>
                <div className="border rounded px-3 py-2 bg-gray-100 text-gray-700">{creator.email}</div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Payout Email</label>
                <div className="border rounded px-3 py-2 bg-gray-100 text-gray-700">{creator.payoutEmail}</div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Social Links</label>
                <div className="border rounded px-3 py-2 bg-gray-100 text-gray-700">{creator.socials}</div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Bio</label>
                <div className="border rounded px-3 py-2 bg-gray-100 text-gray-700 whitespace-pre-line">{creator.bio}</div>
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
              <div>
                <label className="font-semibold block mb-1">Payout Email</label>
                <input
                  name="payoutEmail"
                  type="email"
                  value={form.payoutEmail}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Social Links</label>
                <input
                  name="socials"
                  value={form.socials}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                  disabled={loading}
                  rows={3}
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
        {/* Stats Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-8 flex-1 flex flex-col items-center justify-center min-w-[260px]">
          <div className="mb-4 w-full flex flex-col items-center">
            <span className="font-semibold text-gray-700 mb-1">Affiliate Code</span>
            <div className="flex items-center gap-2">
              <span className="text-blue-700 font-mono text-base bg-white px-2 py-1 rounded">{creator.affiliateCode}</span>
              <button onClick={handleCopy} className="ml-1 px-2 py-1 bg-blue-200 rounded text-blue-700 text-xs hover:bg-blue-300 transition">Copy</button>
            </div>
          </div>
          <div className="w-full mt-2">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg shadow p-3">
                <div className="text-xs text-gray-500">Clicks</div>
                <div className="font-bold text-blue-700 text-lg">{creator.stats?.clicks ?? 0}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-3">
                <div className="text-xs text-gray-500">Sales</div>
                <div className="font-bold text-green-600 text-lg">{creator.stats?.sales ?? 0}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-3">
                <div className="text-xs text-gray-500">Earnings</div>
                <div className="font-bold text-yellow-600 text-lg">${creator.stats?.earnings ?? 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatorProfile