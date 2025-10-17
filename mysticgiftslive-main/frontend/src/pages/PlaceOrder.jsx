import { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import api from '../lib/api'
import Progress from '../components/Progress'
import { useSearchParams } from 'react-router-dom'

const AFFILIATE_DISCOUNT = 10;
const TAX_RATE = 0.1;

const PlaceOrder = () => {
    const [method, setMethod] = useState('stripe');
    const { navigate, token, cartItems, getCartAmount, delivery_fee, user, currency, products } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: user ? user.email : '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });
    const [affiliateCode, setAffiliateCode] = useState('');
    const [affiliateApplied, setAffiliateApplied] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // If cart is empty, redirect to /cart
        const hasItems = Object.values(cartItems).some(item => item && item.quantity > 0);
        if (!hasItems) {
            navigate('/cart');
        }
        // If Stripe cancel, show toast
        if (searchParams.get('cancel') === 'true') {
            toast.info("Payment was cancelled. You can try again.");
        }
    }, [cartItems, navigate, searchParams]);

    useEffect(() => {
        // If user changes (login/logout), update email in formData
        setFormData(data => ({
            ...data,
            email: user?.email || ''
        }));
    }, [user]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    };

    const handleApplyAffiliate = async () => {
        if (!affiliateCode) return toast.error("Please enter a valid affiliate code.");
        try {
            const res = await api.post('/api/user/validate-affiliate', { code: affiliateCode });
            if (res.data.success && res.data.valid) {
                setDiscount(res.data.discount || AFFILIATE_DISCOUNT);
                setAffiliateApplied(true);
                toast.success('Affiliate code applied!');
            } else {
                setDiscount(0);
                setAffiliateApplied(false);
                toast.error(res.data.message || 'Invalid affiliate code');
            }
        } catch (err) {
            setDiscount(0);
            setAffiliateApplied(false);
            toast.error('Could not validate affiliate code');
        }
    };
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        let hasItems = Object.values(cartItems).some(item => item && item.quantity > 0);
        if (!hasItems) {
            toast.error("Your cart is empty!");
            return;
        }

        try {
            let orderItems = [];
            for (const itemId in cartItems) {
                if (cartItems[itemId] && cartItems[itemId].quantity > 0) {
                    orderItems.push({ ...cartItems[itemId] });
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: total,
                affiliateCode: affiliateApplied ? affiliateCode : '',
                tax: tax
            };

            console.log('Placing order with token:', token ? 'Present' : 'Not present');
            console.log('User info:', user ? user._id : 'No user');

            // Always include token in headers if available
            const headers = {};
            if (token) {
                headers.token = token;
            }

            console.log('Headers being sent:', headers);

            // Create Stripe session
            const responseStripe = await api.post('/api/order/createStripeSession', orderData, {
                headers,
                withCredentials: true
            });

            if (responseStripe.data.success && responseStripe.data.session_url) {
                window.location.replace(responseStripe.data.session_url);
            } else {
                toast.error(responseStripe.data.message || "Could not start payment.");
            }
        } catch (error) {
            console.error('Order placement error:', error);
            toast.error(error.message)
        }
    };

    // Calculate totals
    const subtotal = getCartAmount();
    const tax = Number((subtotal * TAX_RATE).toFixed(2));
    const totalBeforeDiscount = subtotal + tax + delivery_fee;
    const total = Math.max(0, totalBeforeDiscount - discount);

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-2 sm:px-6 lg:px-16">
            <div className="max-w-7xl mx-auto">
                <Progress activeStep="shipping" />
                <form onSubmit={onSubmitHandler} className="flex flex-col-reverse md:flex-row gap-10 pt-8">
                    {/* Left Side: Shipping & Contact */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm p-8 mb-8 md:mb-0">
                        <Title text1="Checkout" text2="" />
                        <hr className="my-6" />
                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-2">Contact Information</h3>
                            <input required onChange={onChangeHandler} name="email" value={formData.email} className="w-full px-4 py-2 border rounded mb-4" type="email" placeholder="Email address" />
                        </div>
                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-2">Shipping Information</h3>
                            <div className="flex gap-4 mb-4">
                                <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className="w-1/2 px-4 py-2 border rounded" type="text" placeholder="First name" />
                                <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className="w-1/2 px-4 py-2 border rounded" type="text" placeholder="Last name" />
                            </div>
                            <input required onChange={onChangeHandler} name="phone" value={formData.phone} className="w-full px-4 py-2 border rounded mb-4" type="text" placeholder="Phone number" />
                            <input required onChange={onChangeHandler} name="street" value={formData.street} className="w-full px-4 py-2 border rounded mb-4" type="text" placeholder="Address line 1" />
                            <input onChange={onChangeHandler} name="street2" value={formData.street2 || ''} className="w-full px-4 py-2 border rounded mb-4" type="text" placeholder="Address line 2 (optional)" />
                            <div className="flex gap-4 mb-4">
                                <input required onChange={onChangeHandler} name="city" value={formData.city} className="w-1/2 px-4 py-2 border rounded" type="text" placeholder="City" />
                                <input required onChange={onChangeHandler} name="state" value={formData.state} className="w-1/2 px-4 py-2 border rounded" type="text" placeholder="State" />
                            </div>
                            <div className="flex gap-4 mb-4">
                                <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} className="w-1/2 px-4 py-2 border rounded" type="text" placeholder="Zipcode" />
                                <input required onChange={onChangeHandler} name="country" value={formData.country} className="w-1/2 px-4 py-2 border rounded" type="text" placeholder="Country" />
                            </div>
                        </div>
                        <hr className="my-6" />
                        {/* Affiliate Code */}
                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-2">Affiliate Code</h3>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    className="flex-1 px-4 py-2 border rounded"
                                    placeholder="Enter affiliate code"
                                    value={affiliateCode}
                                    onChange={e => setAffiliateCode(e.target.value)}
                                    disabled={affiliateApplied}
                                />
                                <button
                                    type="button"
                                    className={`px-6 py-2 rounded font-semibold transition ${affiliateApplied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                    onClick={handleApplyAffiliate}
                                    disabled={affiliateApplied}
                                >
                                    {affiliateApplied ? 'Applied' : 'Apply'}
                                </button>
                            </div>
                            {discount > 0 && (
                                <p className="mt-2 text-green-600 font-semibold">Discount applied: -${discount}</p>
                            )}
                        </div>
                        <hr className="my-6" />
                        {/* Payment Method */}
                        <div className="mb-8">
                            <Title text1="Payment" text2="Method" />
                            <div className="flex flex-col gap-3 mt-4">
                                <div onClick={() => setMethod('stripe')} className={`flex items-center gap-3 border p-3 rounded cursor-pointer ${method === 'stripe' ? 'border-blue-600 bg-blue-50' : ''}`}>
                                    <span className={`w-4 h-4 border rounded-full flex items-center justify-center ${method === 'stripe' ? 'bg-blue-600' : ''}`}></span>
                                    <img className="h-5 mx-4" src={assets.stripe_logo} alt="Stripe" />
                                    <span className="text-gray-700 font-medium">Stripe</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full text-end mt-8">
                            <button type="submit" className="bg-black text-white px-16 py-3 text-base rounded-lg font-semibold hover:bg-gray-900 transition">Place Order</button>
                        </div>
                    </div>
                    {/* Right Side: Cart Items & Summary */}
                    <div className="w-full md:w-[420px]">
                        <div className="bg-white rounded-2xl shadow-sm p-8">
                            <h3 className="font-bold text-lg mb-6">Order Details</h3>
                            <div className="flex flex-col gap-6">
                                {Object.values(cartItems).filter(item => item && item.quantity > 0).map((item, idx) => {
                                    // Find product data for original price
                                    const productData = products.find(p => p._id === item.id || p._id === item._id);
                                    const hasDiscount = productData && Number(productData.originalPrice) > Number(productData.finalPrice);
                                    return (
                                        <div key={idx} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border" />
                                            <div className="flex-1">
                                                <div className="font-semibold text-base">{item.name}</div>
                                                <div className="text-gray-500 text-sm">Qty: {item.quantity}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-orange-600 font-bold">{currency}{productData?.finalPrice}</span>
                                                    {hasDiscount && (
                                                        <span className="text-gray-400 line-through text-sm">{currency}{productData?.originalPrice}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="font-bold text-gray-700">{currency}{item.price}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            <hr className="my-6" />
                            <div className="flex flex-col gap-2 text-base">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{currency}{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>{currency}{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>{currency}{delivery_fee.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600 font-semibold">
                                        <span>Discount</span>
                                        <span>-{currency}{discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-lg mt-2">
                                    <span>Total</span>
                                    <span>{currency}{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PlaceOrder