const SubtlePattern = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      className="pointer-events-none py-4 px-2"
    >
      <defs>
        <pattern
          id="subtlePattern"
          patternUnits="userSpaceOnUse"
          width="20"
          height="20"
          patternTransform="scale(1)"
          className="text-gray-400"
        >
          <circle cx="5" cy="5" r="1" fill="currentColor" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#subtlePattern)" />
    </svg>
  )
}

export default SubtlePattern
