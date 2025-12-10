export function PastelBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#fdfdfc]">
      {/* Top left - mint and yellow linear circle */}
      <div className="absolute -left-20 -top-20 h-[280px] w-[280px] rounded-full bg-linear-to-br from-[#2DB1C8] to-[#BAD56E] opacity-40" />

      {/* Top left - smaller mint circle */}
      <div className="absolute -left-20 top-25 h-[180px] w-[180px] rounded-full bg-linear-to-br from-[#2DB1C8] to-[#BAD56E] opacity-40" />

      <svg
        className="absolute left-0 top-0 h-[400px] w-full"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="装飾的な円"
        role="img"
      >
        <title>Decorative circle background</title>
        <circle cx="80" cy="10" r="150" stroke="#8B7355" strokeWidth="1.5" fill="none" />
      </svg>

      {/* Left middle - peach circle */}
      <div className="absolute -left-24 top-[45%] h-[240px] w-[240px] rounded-full bg-linear-to-br from-[#FF442C] to-[#BAD56E] opacity-30" />

      {/* Right bottom - large lavender circle */}
      <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-linear-to-br from-[#EC1ADE] to-[#BAD56E] opacity-30" />

      <svg
        className="absolute bottom-0 right-0 h-[600px] w-full"
        viewBox="0 0 400 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="装飾的な円"
        role="img"
      >
        <title>Decorative circle background</title>
        <circle cx="400" cy="320" r="200" stroke="#8B7355" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}
