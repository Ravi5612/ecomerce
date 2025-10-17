import { useEffect, useState } from 'react'
import { useAdminAuth } from '../lib/AdminAuthContext'
import { backendUrl } from '../lib/config'

const Creators = () => {
  const { accessToken } = useAdminAuth()
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCreators = async () => {
      if (!accessToken) return
      const res = await fetch(`${backendUrl}/api/admin/creators`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      const data = await res.json()
      if (data.success) setCreators(data.creators)
      setLoading(false)
    }
    fetchCreators()
  }, [accessToken])

  if (loading) return <div className="flex justify-center items-center h-64 text-lg">Loading creators...</div>

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-left">All Creators</h1>
        <p className="text-gray-500 mb-4 text-sm sm:text-base text-left">View and manage all creators, their affiliate stats, and payout details.</p>
      </div>
      
      {/* Table Container with Proper Scrolling */}
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="min-w-[1000px] w-full text-sm border border-gray-200">
            <thead>
              <tr className="bg-blue-50 text-gray-700 border-b border-gray-300">
                <th className="py-3 px-4 text-left font-semibold whitespace-nowrap">Name</th>
                <th className="py-3 px-4 text-left font-semibold whitespace-nowrap">Email</th>
                <th className="py-3 px-4 text-left font-semibold whitespace-nowrap">Affiliate Code</th>
                <th className="py-3 px-4 text-center font-semibold whitespace-nowrap">Clicks</th>
                <th className="py-3 px-4 text-center font-semibold whitespace-nowrap">Sales</th>
                <th className="py-3 px-4 text-center font-semibold whitespace-nowrap">Earnings</th>
                <th className="py-3 px-4 text-left font-semibold whitespace-nowrap">Bio</th>
                <th className="py-3 px-4 text-left font-semibold whitespace-nowrap">Socials</th>
                <th className="py-3 px-4 text-left font-semibold whitespace-nowrap">Payout Email</th>
              </tr>
            </thead>
            <tbody>
              {creators.map(c => (
                <tr key={c._id} className="border-b border-gray-200 hover:bg-blue-50 transition">
                  <td className="py-3 px-4 whitespace-nowrap">{c.name}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{c.email}</td>
                  <td className="py-3 px-4 font-mono text-blue-700 whitespace-nowrap">{c.affiliateCode}</td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">{c.stats?.clicks ?? 0}</td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">{c.stats?.sales ?? 0}</td>
                  <td className="py-3 px-4 text-center font-semibold text-green-700 whitespace-nowrap">${c.stats?.earnings ?? 0}</td>
                  <td className="py-3 px-4 max-w-[200px] truncate">{c.bio}</td>
                  <td className="py-3 px-4 max-w-[150px] truncate">{c.socials}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{c.payoutEmail}</td>
                </tr>
              ))}
              {creators.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400">No creators found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Creators