import { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from "../lib/config";
import { toast } from 'react-toastify'
import Pagination from '../components/Pagination'
import { useAdminAuth } from '../lib/AdminAuthContext.jsx'

const ITEMS_PER_PAGE = 5

const Messages = () => {
  const { accessToken } = useAdminAuth()
  const [messages, setMessages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const fetchMessages = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/contact/messages', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (response.data.success) {
        setMessages(response.data.messages)
      }
    } catch (error) {
      toast.error('Error fetching messages')
    }
  }

  const markAsRead = async (messageId) => {
    try {
      const response = await axios.post(backendUrl + '/api/contact/mark-read',
        { messageId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (response.data.success) {
        fetchMessages()
        toast.success('Message marked as read')
      }
    } catch (error) {
      toast.error('Error updating message')
    }
  }

  const deleteMessage = async (messageId) => {
    try {
      const response = await axios.post(backendUrl + '/api/contact/delete',
        { messageId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (response.data.success) {
        fetchMessages()
        toast.success('Message deleted')
      }
    } catch (error) {
      toast.error('Error deleting message')
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [accessToken])

  // Pagination logic
  const totalPages = Math.ceil(messages.length / ITEMS_PER_PAGE)
  const paginatedMessages = messages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-left">Contact Messages</h1>
      <div className="space-y-4">
        {paginatedMessages.map((message) => (
          <div
            key={message._id}
            className={`border rounded-lg p-4 ${
              message.status === 'unread' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">
                  {message.firstName} {message.lastName}
                  {message.status === 'unread' && (
                    <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                      New
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600">{message.email}</p>
                {message.phone && (
                  <p className="text-sm text-gray-600">{message.phone}</p>
                )}
              </div>
              <div className="flex space-x-2">
                {message.status === 'unread' && (
                  <button
                    onClick={() => markAsRead(message._id)}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => deleteMessage(message._id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mb-2">
              <p className="text-gray-800">{message.message}</p>
            </div>
            <div className="text-xs text-gray-500">
              Received: {new Date(message.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {messages.length === 0 && (
        <p className="text-gray-500 text-center py-8">No messages yet</p>
      )}
    </div>
  )
}

export default Messages