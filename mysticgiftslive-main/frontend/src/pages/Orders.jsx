import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import SimpleBanner from '../components/Blog/SimpleBanner'
import Pagination from '../components/Pagination'
import api from '../lib/api'
import { FaBoxOpen, FaClipboardList, FaTruck, FaShippingFast, FaCheckCircle, FaEye } from 'react-icons/fa'

const statusSteps = [
    { label: 'Order Placed', icon: <FaClipboardList size={14} /> },
    { label: 'Packing', icon: <FaBoxOpen size={14} /> },
    { label: 'Shipped', icon: <FaTruck size={14} /> },
    { label: 'Out for Delivery', icon: <FaShippingFast size={14} /> },
    { label: 'Delivered', icon: <FaCheckCircle size={14} /> }
];

const ORDERS_PER_PAGE = 4;

function getStatusIndex(status) {
    return statusSteps.findIndex(s => s.label.toLowerCase() === status.toLowerCase());
}

const Orders = () => {
    const { token, currency, backendUrl, navigate } = useContext(ShopContext);
    const [orderData, setOrderData] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const loadOrderData = async () => {
        if (token) {
            try {
                const response = await api.post(backendUrl + '/api/order/userorders', {}, { 
                    headers: { token },
                    withCredentials: true 
                });
                if (response.data.success) {
                    setOrderData(response.data.orders || []);
                    setError(null);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError('Failed to load orders');
            }
        } else {
            setOrderData([]);
        }
        setLoading(false);
    }

    const formatOrderId = (id) => id ? `#${id.slice(-8)}` : '#N/A';
    const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    const getTotalItems = (items) => items.reduce((total, item) => total + item.quantity, 0);
    const viewProduct = (itemId) => navigate(`/product/${itemId}`);

    useEffect(() => { 
        loadOrderData();
    }, [token]);

    useEffect(() => {
        setCurrentPage(1);
    }, [orderData.length]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Your Orders</h2>
                <p className="text-lg text-red-500">Error: {error}</p>
                <button 
                    onClick={loadOrderData}
                    className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!orderData.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="text-center">
                    <FaBoxOpen size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Your Orders</h2>
                    <p className="text-lg text-gray-500 mb-6">No orders found. Start shopping to see your orders here!</p>
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={loadOrderData}
                            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-200"
                        >
                            Refresh
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Start Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Pagination logic
    const totalPages = Math.ceil(orderData.length / ORDERS_PER_PAGE);
    const paginatedOrders = [...orderData]
        .sort((a, b) => b.date - a.date)
        .slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE);

    return (
        <div className="min-h-[80vh] w-full bg-gradient-to-br from-blue-50 to-white py-20 px-2 sm:px-6 lg:px-16">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <SimpleBanner
                        title="Your Orders"
                        description="Track your orders and manage your purchases."
                    />
                </div>
                <div className="space-y-8">
                    {paginatedOrders.map((order, orderIndex) => {
                        const statusIdx = getStatusIndex(order.status);
                        const totalItems = getTotalItems(order.items);
                        return (
                            <div 
                                key={order._id} 
                                className={`bg-white rounded-xl shadow-md border-2 transition-all duration-200 hover:shadow-lg ${
                                    orderIndex === 0 && currentPage === 1 ? 'border-blue-200 ring-2 ring-blue-100' : 'border-gray-200'
                                }`}
                            >
                                {orderIndex === 0 && currentPage === 1 && (
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-t-xl">
                                        <p className="text-sm font-semibold flex items-center gap-2">
                                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                            Most Recent Order
                                        </p>
                                    </div>
                                )}
                                <div className="p-6">
                                    {/* Order Header */}
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                                            <div>
                                                <p className="text-sm text-gray-500">Order ID</p>
                                                <p className="text-lg font-bold text-gray-900">{formatOrderId(order._id)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Order Date</p>
                                                <p className="text-sm font-semibold text-gray-700">{formatDate(order.date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Total Items</p>
                                                <p className="text-sm font-semibold text-gray-700">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Total Amount</p>
                                                <p className="text-2xl font-bold text-green-600">{currency}{order.amount}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Order Status */}
                                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        {/* Order Status Tracker */}
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500 mb-3">
                                                Order Status: <span className="font-semibold text-gray-900">{order.status}</span>
                                            </p>
                                            <div className="flex items-center w-full overflow-x-auto py-2">
                                                {statusSteps.map((step, idx) => (
                                                    <div key={step.label} className="flex flex-row items-center">
                                                        {/* Step: icon above label */}
                                                        <div className="flex flex-col items-center min-w-[60px]">
                                                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 mb-1 transition-all duration-200 ${
                                                                idx <= statusIdx 
                                                                    ? 'border-green-500 bg-green-500 text-white' 
                                                                    : 'border-gray-300 bg-white text-gray-400'
                                                            }`}>
                                                                {step.icon}
                                                            </div>
                                                            <span className={`text-xs font-medium text-center ${
                                                                idx <= statusIdx ? 'text-green-600' : 'text-gray-400'
                                                            }`}>
                                                                {step.label}
                                                            </span>
                                                        </div>
                                                        {/* Connecting line between steps */}
                                                        {idx < statusSteps.length - 1 && (
                                                            <div className={`h-1 w-8 mb-4 mx-1 rounded transition-all duration-200 ${
                                                                idx < statusIdx ? 'bg-green-500' : 'bg-gray-200'
                                                            }`} />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-4 md:items-center md:min-w-[180px]">
                                            {order.invoiceUrl && (
                                                <a
                                                    href={order.invoiceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-200 font-medium text-sm"
                                                >
                                                    Download Invoice
                                                </a>
                                            )}
                                            {order.trackingUrl && (
                                                <a
                                                    href={order.trackingUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium text-sm"
                                                >
                                                    Track Order
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    {/* Order Items */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
                                        <div className="space-y-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name} 
                                                        className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-sm"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <span>Qty: <span className="font-semibold text-gray-900">{item.quantity}</span></span>
                                                            <span>•</span>
                                                            <span>Price: <span className="font-semibold text-green-500">{currency}{item.price}</span></span>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => viewProduct(item.id)}
                                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium"
                                                    >
                                                        <FaEye size={14} />
                                                        View Product
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Order Actions */}
                                    <div className="border-t border-gray-200 pt-6 mt-6">
                                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                            {order.invoiceUrl && (
                                                <a
                                                    href={order.invoiceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-200 font-medium"
                                                >
                                                    Download Invoice
                                                </a>
                                            )}
                                            {order.trackingUrl && (
                                                <a
                                                    href={order.trackingUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                                                >
                                                    Track Order
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    )
}

export default Orders