import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../lib/config';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Subscribers = ({ token }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/newsletter/subscribers', {
        headers: { token }
      });
      
      if (response.data.success) {
        setSubscribers(response.data.subscribers);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSubscribers();
    }
  }, [token]);

  const deleteSubscriber = async (subscriberId) => {
    if (!window.confirm('Are you sure you want to remove this subscriber?')) {
      return;
    }

    try {
      const response = await axios.delete(backendUrl + `/api/newsletter/subscribers/${subscriberId}`, {
        headers: { token }
      });
      
      if (response.data.success) {
        setSubscribers(prev => prev.filter(sub => sub._id !== subscriberId));
        toast.success('Subscriber removed successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Failed to remove subscriber');
    }
  };

  const exportSubscribers = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Subscribed Date\n"
      + subscribers.map(sub => `${sub.email},${new Date(sub.subscribedAt).toLocaleDateString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "newsletter_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Subscribers exported successfully!');
  };

  // Fallback icon component if email_icon is not available
  const EmailIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading subscribers...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          {assets.email_icon ? (
            <img src={assets.email_icon} alt="Email" className="w-8 h-8" />
          ) : (
            <div className="w-8 h-8 text-blue-600">
              <EmailIcon />
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Newsletter Subscribers</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {subscribers.length > 0 && (
            <button
              onClick={exportSubscribers}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              {assets.email_icon ? (
                <img src={assets.email_icon} alt="Export" className="w-4 h-4" />
              ) : (
                <EmailIcon />
              )}
              Export CSV
            </button>
          )}
          <div className="bg-blue-100 px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap">
            {assets.email_icon ? (
              <img src={assets.email_icon} alt="Total" className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4 text-blue-600">
                <EmailIcon />
              </div>
            )}
            <span className="text-blue-800 font-semibold">Total: {subscribers.length}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {subscribers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          {assets.email_icon ? (
            <img src={assets.email_icon} alt="No subscribers" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          ) : (
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          )}
          <h3 className="text-xl text-gray-600">No subscribers yet</h3>
          <p className="text-gray-500 mt-2">When users subscribe to your newsletter, they'll appear here.</p>
        </div>
      ) : (
        <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="min-w-[700px] w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {assets.email_icon ? (
                        <img src={assets.email_icon} alt="Email" className="w-4 h-4" />
                      ) : (
                        <EmailIcon />
                      )}
                      Email Address
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Subscribed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscribers.map((subscriber, index) => (
                  <tr key={subscriber._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        {assets.email_icon ? (
                          <img src={assets.email_icon} alt="Email" className="w-4 h-4 opacity-60" />
                        ) : (
                          <div className="w-4 h-4 text-gray-400">
                            <EmailIcon />
                          </div>
                        )}
                        {subscriber.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(subscriber.subscribedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subscriber.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteSubscriber(subscriber._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscribers;