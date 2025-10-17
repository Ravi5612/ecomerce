const LoadingButton = ({ loading, text, children, className = "", ...props }) => (
  <button
    disabled={loading}
    className={`px-3 py-1 rounded transition flex items-center justify-center
      ${loading ? "bg-blue-400 cursor-not-allowed opacity-70" : "bg-blue-600 hover:bg-blue-700"}
      text-white font-medium ${className}`}
    {...props}
  >
    {loading ? (
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none"/>
        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
    ) : (
      <>
        {text}
        {children}
      </>
    )}
  </button>
);

export default LoadingButton;