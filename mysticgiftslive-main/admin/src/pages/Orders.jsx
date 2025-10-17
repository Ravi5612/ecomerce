import { useEffect, useState } from 'react'
import axios from 'axios'
import { currency } from '../App'
import { backendUrl } from '../lib/config'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import Pagination from '../components/Pagination'
import { useAdminAuth } from '../lib/AdminAuthContext'

const ITEMS_PER_PAGE = 6

const Orders = () => {
  const { accessToken } = useAdminAuth()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortBy, setSortBy] = useState('date-desc')
  const [statusLoading, setStatusLoading] = useState({});

  const fetchAllOrders = async () => {
    if (!accessToken) return null;
    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    setStatusLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      toast.error("Failed to update status")
    } finally {
      setStatusLoading(prev => ({ ...prev, [orderId]: false }));
    }
  }

  useEffect(() => {
    fetchAllOrders();
    // eslint-disable-next-line
  }, [accessToken])

  useEffect(() => {
    let filtered = [...orders];

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Search by name, phone, address, order id
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.items.some(item => item.name.toLowerCase().includes(term)) ||
        (order.address?.firstName?.toLowerCase().includes(term) || '') ||
        (order.address?.lastName?.toLowerCase().includes(term) || '') ||
        (order.address?.phone?.toLowerCase().includes(term) || '') ||
        (order._id?.toLowerCase().includes(term) || '')
      );
    }

    // Sort
    if (sortBy === 'date-desc') {
      filtered.sort((a, b) => Number(b.date) - Number(a.date));
    } else if (sortBy === 'date-asc') {
      filtered.sort((a, b) => Number(a.date) - Number(b.date));
    } else if (sortBy === 'amount-desc') {
      filtered.sort((a, b) => Number(b.amount) - Number(a.amount));
    } else if (sortBy === 'amount-asc') {
      filtered.sort((a, b) => Number(a.amount) - Number(b.amount));
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, searchTerm, filterStatus, sortBy]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="max-w-8xl mx-auto px-1 pb-10 min-h-screen">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-left">Orders</h1>
      {/* Filters and Sorting */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search by name, phone, order id..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded focus:outline-blue-400 text-sm w-full sm:w-56"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 border rounded focus:outline-blue-400 text-sm w-full sm:w-44"
        >
          <option value="">All Status</option>
          <option value="Order Placed">Order Placed</option>
          <option value="Packing">Packing</option>
          <option value="Shipped">Shipped</option>
          <option value="Out for delivery">Out for delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-3 py-2 border rounded focus:outline-blue-400 text-sm w-full sm:w-44"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Amount: High to Low</option>
          <option value="amount-asc">Amount: Low to High</option>
        </select>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {paginatedOrders.map((order) => (
            <div
              className="rounded-2xl border border-gray-200 bg-white shadow hover:shadow-lg transition-shadow px-4 py-5 flex flex-col gap-3 relative"
              key={order._id}
            >
              {/* Order ID and Status */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">ID: {order._id.slice(-8)}</span>
                <span className={`text-xs px-2 py-1 rounded font-semibold
                  ${order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Out for delivery"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}>
                  {order.status}
                </span>
              </div>
              {/* Email Address */}
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">
                  {order.userId && order.userId !== 'guest' ? `${order.address.email} - User` : `${order.address.email} - Guest`}
                </span>
              </div>
              {/* Products List */}
              <div className="mb-2">
                <div className="font-semibold text-gray-800 text-sm mb-1">Products:</div>
                <ul className="list-disc pl-4 text-xs text-gray-700 space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      <span className="font-medium">{item.name}</span>
                      {item.size && <span className="text-gray-500"> ({item.size})</span>}
                      <span className="text-gray-500"> x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Customer Info */}
              <div className="text-xs text-gray-600 mb-1">
                <span className="font-semibold">{order.address.firstName} {order.address.lastName}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span>{order.address.phone}</span>
                <br/>
                <span className='text-xs truncate pt-1 block'>{order.address.street}, {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</span>
              </div>
              {/* Payment & Amount */}
              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold text-blue-700 text-base">{currency}{order.amount}</span>
                <span className="text-xs">
                  Payment: <span className={order.payment ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>{order.payment ? 'Done' : 'Pending'}</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                <span>Method: {order.paymentMethod}</span>
                <span>Date: {new Date(order.date).toLocaleDateString()}</span>
              </div>
              {/* Status Change */}
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="p-2 rounded border font-semibold bg-gray-50 focus:outline-blue-400 mt-2 w-full"
                disabled={!!statusLoading[order._id]}
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
              {statusLoading[order._id] && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-white rounded-full"></span>
                  <span className="text-xs text-blue-600">Updating status...</span>
                </div>
              )}
              {/* Tracking URL */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Tracking URL"
                  defaultValue={order.trackingUrl || ''}
                  className="px-2 py-1 border rounded w-full text-xs"
                  id={`tracking-${order._id}`}
                />
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 disabled:opacity-60"
                  disabled={order._trackingLoading}
                  onClick={async () => {
                    const url = document.getElementById(`tracking-${order._id}`).value.trim();
                    if (url !== (order.trackingUrl || '')) {
                      // Set loading state
                      setOrders(orders =>
                        orders.map(o =>
                          o._id === order._id ? { ...o, _trackingLoading: true } : o
                        )
                      );
                      try {
                        await axios.post(
                          backendUrl + '/api/order/tracking',
                          { orderId: order._id, trackingUrl: url },
                          { headers: { Authorization: `Bearer ${accessToken}` } }
                        );
                        toast.success('Tracking URL updated');
                        await fetchAllOrders();
                      } catch (err) {
                        toast.error('Failed to update tracking URL');
                      } finally {
                        setOrders(orders =>
                          orders.map(o =>
                            o._id === order._id ? { ...o, _trackingLoading: false } : o
                          )
                        );
                      }
                    }
                  }}
                >
                  {order._trackingLoading ? (
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-blue-400 rounded-full"></span>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>

              {/* Invoice URL */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Invoice URL"
                  defaultValue={order.invoiceUrl || ''}
                  className="px-2 py-1 border rounded w-full text-xs"
                  id={`invoice-${order._id}`}
                />
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 disabled:opacity-60"
                  disabled={order._invoiceLoading}
                  onClick={async () => {
                    const url = document.getElementById(`invoice-${order._id}`).value.trim();
                    if (url !== (order.invoiceUrl || '')) {
                      // Set loading state
                      setOrders(orders =>
                        orders.map(o =>
                          o._id === order._id ? { ...o, _invoiceLoading: true } : o
                        )
                      );
                      try {
                        await axios.post(
                          backendUrl + '/api/order/invoice',
                          { orderId: order._id, invoiceUrl: url },
                          { headers: { Authorization: `Bearer ${accessToken}` } }
                        );
                        toast.success('Invoice URL updated');
                        await fetchAllOrders();
                      } catch (err) {
                        toast.error('Failed to update invoice URL');
                      } finally {
                        setOrders(orders =>
                          orders.map(o =>
                            o._id === order._id ? { ...o, _invoiceLoading: false } : o
                          )
                        );
                      }
                    }
                  }}
                >
                  {order._invoiceLoading ? (
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-green-400 rounded-full"></span>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {filteredOrders.length === 0 && (
        <p className="text-gray-500 text-center py-8">No orders found</p>
      )}
    </div>
  )
}

export default Orders