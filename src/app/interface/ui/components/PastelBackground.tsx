export function PastelBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#F5F5F0]">
      {/* Top left - mint and yellow gradient circle */}
      <div className="absolute -left-20 -top-20 h-[280px] w-[280px] rounded-full bg-gradient-to-br from-[#C8E6E0] to-[#F5F0D5] opacity-60" />

      {/* Top left - smaller mint circle */}
      <div className="absolute left-8 top-32 h-[180px] w-[180px] rounded-full bg-[#C8E6E0] opacity-40" />

      {/* Top curve */}
      <svg
        className="absolute left-0 top-0 h-[400px] w-full"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 30 290 Q 150 200 350 100 L 350 0 L 30 0 Z"
          stroke="#8B7355"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Left middle - peach circle */}
      <div className="absolute -left-24 top-[45%] h-[240px] w-[240px] rounded-full bg-gradient-to-br from-[#F5D5C8] to-[#F5F0D5] opacity-50" />

      {/* Right bottom - large lavender circle */}
      <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[#E0D5F5] opacity-50" />

      {/* Right bottom curve */}
      <svg
        className="absolute bottom-0 right-0 h-[600px] w-full"
        viewBox="0 0 400 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M 250 200 Q 350 400 450 600" stroke="#8B7355" strokeWidth="2" fill="none" />
      </svg>

      {/* Center bottom - pink circle */}
      <div className="absolute -bottom-20 left-4 h-[200px] w-[200px] rounded-full bg-[#F5D5E0] opacity-60" />
    </div>
  )
}
