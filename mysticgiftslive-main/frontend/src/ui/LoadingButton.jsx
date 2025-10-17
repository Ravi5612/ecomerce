import { cn } from '../lib/utils'

const LoadingButton = ({
  loading,
  children,
  className = "",
  disabled,
  ...props
}) => (
  <button
    disabled={loading || disabled}
    className={cn(
      `flex items-center justify-center px-4 py-2 rounded transition font-semibold
      focus:outline-none focus:ring-2 focus:ring-blue-400
      ${loading ? "bg-blue-400 cursor-not-allowed opacity-70" : "bg-blue-600 hover:bg-blue-700"}
      text-white`,
      className
    )}
    {...props}
  >
    {loading ? (
      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none"/>
        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
    ) : null}
    {children}
  </button>
);

export default LoadingButton;