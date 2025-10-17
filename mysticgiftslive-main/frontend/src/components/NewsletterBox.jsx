import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../lib/config'
import { toast } from 'react-toastify'

const NewsletterBox = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        if (!email) {
            toast.error('Please enter your email address')
            return
        }

        setLoading(true)
        
        try {
            const response = await axios.post(backendUrl + '/api/newsletter/subscribe', {
                email: email
            })
            
            if (response.data.success) {
                toast.success('Subscription successful!')
                setEmail('') // Clear the input
            } else {
                toast.error(response.data.message || 'Email submission failed')
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error)
            
            if (error.response?.status === 400) {
                toast.error('Email already subscribed!')
            } else {
                toast.error('Email submission failed. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='text-center my-10'>
            <p className='text-2xl font-medium text-gray-800'>Subscribe now & get latest offers</p>
            <p className='text-gray-400 mt-3'>
                Stay updated with exclusive deals, product drops, and wellness tips—delivered straight to your inbox.
            </p>
            <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
                <input 
                    className='w-full sm:flex-1 outline-none' 
                    type="email" 
                    placeholder='Enter your email' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />
                <button 
                    type='submit' 
                    className='bg-black text-white text-xs px-10 py-4 hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50'
                    disabled={loading}
                >
                    {loading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
                </button>
            </form>
        </div>
    )
}

export default NewsletterBox