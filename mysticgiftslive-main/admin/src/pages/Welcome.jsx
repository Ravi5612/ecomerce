const Welcome = () => (
  <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8 mt-8">
    <h1 className="text-3xl font-bold mb-2 text-gray-800">Welcome, Admin!</h1>
    <p className="text-gray-600 mb-4">
      This is your admin dashboard. Use the sidebar to manage products, orders, categories, and more.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <h2 className="font-semibold text-blue-700 mb-1">Quick Actions</h2>
        <ul className="list-disc ml-5 text-sm text-blue-900">
          <li>Add new products</li>
          <li>View and manage orders</li>
          <li>Check messages</li>
        </ul>
      </div>
      <div className="bg-green-50 rounded-lg p-4">
        <h2 className="font-semibold text-green-700 mb-1">Account</h2>
        <ul className="list-disc ml-5 text-sm text-green-900">
          <li>Update your profile</li>
          <li>Change password</li>
        </ul>
      </div>
    </div>
  </div>
);

export default Welcome;