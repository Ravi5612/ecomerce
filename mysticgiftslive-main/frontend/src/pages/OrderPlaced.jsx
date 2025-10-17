import { useContext, useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import api from '../lib/api';

const OrderPlaced = () => {
    const [searchParams] = useSearchParams();
    const { token, clearCart, getUserCart, backendUrl, currency } = useContext(ShopContext);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();
    const hasConfirmed = useRef(false);

    useEffect(() => {
        const confirmOrder = async () => {
            const sessionId = searchParams.get('session_id');
            const success = searchParams.get('success');

            if (success === 'true' && sessionId && !hasConfirmed.current) {
                hasConfirmed.current = true;
                
                try {
                    const headers = {};
                    if (token) {
                        headers.token = token;
                    }

                    console.log('Confirming order with:');
                    console.log('- sessionId:', sessionId);
                    console.log('- token:', token ? 'Present' : 'None');
                    console.log('- headers:', headers);

                    const response = await api.post(
                        backendUrl + '/api/order/confirmStripeOrder',
                        { session_id: sessionId },
                        { 
                            headers,
                            withCredentials: true 
                        }
                    );

                    console.log('Order confirmation response:', response.data);

                    if (response.data.success) {
                        setOrder(response.data.order);
                        toast.success('Order placed successfully!');
                        
                        // Clear frontend cart
                        clearCart();
                        
                        // Refresh user cart from backend if logged in
                        if (token) {
                            setTimeout(() => {
                                getUserCart(token);
                            }, 1000); // Give backend time to clear cart
                        }
                    } else {
                        toast.error('Order confirmation failed');
                        navigate('/place-order');
                    }
                } catch (error) {
                    console.error('Order confirmation error:', error);
                    toast.error('Order confirmation failed');
                    navigate('/place-order');
                } finally {
                    setLoading(false);
                }
            } else if (success !== 'true' || !sessionId) {
                navigate('/place-order');
                setLoading(false);
            }
        };

        confirmOrder();
    }, [searchParams, token, clearCart, getUserCart, backendUrl, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Success Header */}
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
                        <p className="text-xl text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
                    </div>

                    {/* Order Details Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <div className="border-b border-gray-200 pb-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Order ID</p>
                                    <p className="font-bold text-lg">#{order._id.slice(-8)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Order Date</p>
                                    <p className="font-semibold">{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                    <p className="font-bold text-xl text-green-600">{currency}{order.amount}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Items Ordered</h3>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="w-16 h-16 object-cover rounded-lg border"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                            <p className="text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800">{currency}{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Shipping Address</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-semibold">{order.address.firstName} {order.address.lastName}</p>
                                <p>{order.address.street}</p>
                                <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                                <p>{order.address.country}</p>
                                <p className="mt-2">Phone: {order.address.phone}</p>
                                <p>Email: {order.address.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/orders')}
                            className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            View All Orders
                        </button>
                        <button
                            onClick={() => navigate('/collection')}
                            className="border border-gray-300 text-gray-700 py-3 px-8 rounded-lg hover:bg-gray-50 transition font-semibold"
                        >
                            Continue Shopping
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="text-center mt-8">
                        <p className="text-gray-600">
                            You will receive an email confirmation shortly at <span className="font-semibold">{order.address.email}</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default OrderPlaced;