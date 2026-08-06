/**
 * Spinner — inline loading indicator.
 * Accepts a className for sizing (default: w-5 h-5).
 */
const Spinner = ({ className = 'w-5 h-5' }) => (
  <svg
    className={`animate-spin text-[#4CAF50] ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
)

export default Spinner
