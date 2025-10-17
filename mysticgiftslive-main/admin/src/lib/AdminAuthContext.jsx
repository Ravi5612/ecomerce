import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { backendUrl } from './config'
import { toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'

const AdminAuthContext = createContext()

export const useAdminAuth = () => useContext(AdminAuthContext)

export const AdminAuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true) // Start with loading true
  const [loggedOut, setLoggedOut] = useState(false)
  const location = useLocation()

  // Try refresh on mount and when needed
  useEffect(() => {
    if (accessToken) {
      setLoading(false)
      return
    }
    if (loggedOut) {
      setLoading(false)
      return
    }

    const tryRefresh = async () => {
      setLoading(true)
      try {
        const res = await axios.post(
          backendUrl + '/api/admin/refresh',
          {},
          { withCredentials: true }
        )
        if (res.data.success) {
          setAccessToken(res.data.accessToken)
          setAdmin(res.data.admin || null)
        }
      } catch {
        setAccessToken(null)
        setAdmin(null)
      } finally {
        setLoading(false)
      }
    }
    
    tryRefresh()
  }, [accessToken, loggedOut]) // Removed location.pathname dependency

  // Login
  const login = async (email, password) => {
    setLoading(true)
    setLoggedOut(false)
    try {
      const res = await axios.post(
        backendUrl + '/api/admin/login',
        { email, password },
        { withCredentials: true }
      )
      if (res.data.success) {
        setAccessToken(res.data.accessToken)
        setAdmin(res.data.admin)
        toast.success('Login successful')
        return true
      } else {
        toast.error(res.data.message)
        return false
      }
    } catch (err) {
      toast.error('Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    await axios.post(backendUrl + '/api/admin/logout', {}, { withCredentials: true })
    setAccessToken(null)
    setAdmin(null)
    setLoggedOut(true)
    setLoading(false)
    toast.success('Logged out')
  }

  // Refresh token
  const refresh = useCallback(async () => {
    try {
      const res = await axios.post(
        backendUrl + '/api/admin/refresh',
        {},
        { withCredentials: true }
      )
      if (res.data.success) {
        setAccessToken(res.data.accessToken)
        setAdmin(res.data.admin || null)
        return res.data.accessToken
      }
    } catch {}
    setAccessToken(null)
    setAdmin(null)
    return null
  }, [])

  // Axios interceptor to auto-refresh on 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      res => res,
      async error => {
        const originalRequest = error.config
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true
          const newToken = await refresh()
          if (newToken) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`
            return axios(originalRequest)
          }
        }
        return Promise.reject(error)
      }
    )
    return () => axios.interceptors.response.eject(interceptor)
  }, [refresh])

  return (
    <AdminAuthContext.Provider value={{
      accessToken,
      admin,
      loading,
      login,
      logout,
      refresh,
      setAccessToken,
      setAdmin
    }}>
      {children}
    </AdminAuthContext.Provider>
  )
}