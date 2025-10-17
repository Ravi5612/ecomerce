import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { backendUrl } from "../lib/config";
import api from "../lib/api";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [user, setUser] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [role, setRole] = useState('');
    const [loadingToken, setLoadingToken] = useState(true);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // 1. FIRST: Set up axios interceptor (independent of token state)
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;
                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const res = await axios.post(backendUrl + '/api/refresh', {}, { withCredentials: true });
                        if (res.data.success && res.data.accessToken) {
                            setToken(res.data.accessToken);
                            originalRequest.headers['token'] = res.data.accessToken;
                            return api(originalRequest);
                        }
                    } catch (refreshError) {
                        setToken('');
                        navigate('/login');
                        toast.error('Session expired, please log in again.');
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
        return () => api.interceptors.response.eject(interceptor);
    }, [navigate]);
    
    // 2. SECOND: Restore token and role from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        
        if (storedToken) {
            setToken(storedToken);
        }
        if (storedRole) {
            setRole(storedRole);
        }
        
        setLoadingToken(false);
    }, []);

    // 3. THIRD: Fetch user profile when token changes
    useEffect(() => {
        if (token) {
            fetchUserProfile(token);
        } else {
            setUser(null);
        }
    }, [token]);

    // 4. FOURTH: Persist token and role to localStorage when they change
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        
        if (role) {
            localStorage.setItem('role', role);
        } else {
            localStorage.removeItem('role');
        }
    }, [token, role]);

    // 5. FIFTH: Load products (independent of user state)
    useEffect(() => {
        getProductsData();
        fetchCategories();
    }, []);

    // 6. SIXTH: Handle cart management when token changes
    useEffect(() => {
        if (token) {
            // User is logged in - merge guest cart and get user cart
            const guestCart = localStorage.getItem('cart');
            if (guestCart) {
                // Merge guest cart with user cart
                api.post(
                    backendUrl + '/api/cart/merge',
                    { cartData: JSON.parse(guestCart) },
                    { headers: { token }, withCredentials: true }
                ).then(() => {
                    localStorage.removeItem('cart');
                    getUserCart(token);
                }).catch(() => {
                    localStorage.removeItem('cart');
                    getUserCart(token);
                });
            } else {
                // No guest cart, just get user cart
                getUserCart(token);
            }
        } else {
            // Not logged in, restore guest cart from localStorage
            const storedCart = localStorage.getItem('cart');
            try {
                if (storedCart) {
                    const parsed = JSON.parse(storedCart);
                    setCartItems(parsed && typeof parsed === 'object' ? parsed : {});
                } else {
                    setCartItems({});
                }
            } catch {
                setCartItems({});
            }
        }
    }, [token]);

    // 7. DEBUG: Log user and token state changes
    useEffect(() => {
        const userId = user?._id || user?.id || 'guest';
        console.log('[ShopContext] userId:', userId, '| token:', token ? 'Present' : 'None');
    }, [user, token]);

    const fetchUserProfile = async (token) => {
        try {
            const res = await api.get(backendUrl + '/api/user/me', { 
                headers: { token }, 
                withCredentials: true 
            });
            if (res.data.success) {
                setUser(res.data.user);
            } else {
                console.error('Failed to fetch user profile:', res.data.message);
                setUser(null);
            }
        } catch (e) {
            console.error('Error fetching user profile:', e);
            setUser(null);
        }
    };

    // --- CART FUNCTIONS ---
    const addToCart = async (itemId, quantity = 1, priceOverride = null) => {
        let cartData = structuredClone(cartItems);
        const product = products.find(p => p._id === itemId);
        if (!product) return;

        const priceToUse = priceOverride !== null
            ? priceOverride
            : Number(product.finalPrice);

        if (cartData[itemId]) {
            cartData[itemId].quantity += quantity;
        } else {
            cartData[itemId] = {
                id: itemId,
                name: product.name,
                price: priceToUse,
                quantity: quantity,
                image: product.image?.[0] || ''
            };
        }
        setCartItems(cartData);

        if (token) {
            try {
                await api.post(backendUrl + '/api/cart/add', { itemId, quantity }, { headers: { token }, withCredentials: true });
            } catch (error) {
                toast.error(error.message);
            }
        } else {
            localStorage.setItem('cart', JSON.stringify(cartData));
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId].quantity = quantity;
            setCartItems(cartData);

            if (token) {
                try {
                    await api.post(backendUrl + '/api/cart/update', { itemId, quantity }, { headers: { token }, withCredentials: true });
                } catch (error) {
                    toast.error(error.message);
                }
            } else {
                localStorage.setItem('cart', JSON.stringify(cartData));
            }
        }
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId] && cartItems[itemId].quantity > 0) {
                totalCount += cartItems[itemId].quantity;
            }
        }
        return totalCount;
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const item = cartItems[itemId];
            if (item && item.quantity > 0) {
                totalAmount += item.price * item.quantity;
            }
        }
        return totalAmount;
    };

    const getProductsData = async () => {
        try {
            const response = await api.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                setProducts(response.data.products.reverse());
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error(error.message);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get(backendUrl + '/api/category/list');
            if (response.data.success) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error(error.message);
        }
    };

    const getUserCart = async (token) => {
        try {
            const response = await api.post(backendUrl + '/api/cart/get', {}, { 
                headers: { token }, 
                withCredentials: true 
            });
            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            }
        } catch (error) {
            console.error('Error getting cart:', error);
            toast.error(error.message);
        }
    };

    const clearCart = async () => {
        setCartItems({});
        localStorage.removeItem('cart');
        
        // If user is logged in, also clear backend cart
        if (token) {
            try {
                await api.post(backendUrl + '/api/cart/clear', {}, {
                    headers: { token },
                    withCredentials: true
                });
                console.log('Backend cart cleared successfully');
            } catch (error) {
                console.error('Error clearing backend cart:', error);
            }
        }
    };

    const logout = async () => {
        setToken('');
        setRole('');
        setUser(null);
        setCartItems({});
        
        try {
            await axios.post(backendUrl + '/api/logout', {}, { withCredentials: true });
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Session expired or already logged out.');
        }
        
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('cart');
        navigate('/');
    };

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token, logout, loadingToken, role, setRole, user, setUser,
        clearCart, getUserCart, categories, setCategories
    };

    if (loadingToken) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;