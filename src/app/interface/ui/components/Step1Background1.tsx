export function Step1Background() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f2f2ed]">
      {/* Top left - mint and yellow linear circle */}
      <div className="absolute left-20 -top-30 h-[280px] w-[280px] rounded-full bg-linear-to-br from-[#2DB1C8] to-[#BAD56E] opacity-40" />

      <div className="absolute inset-0 top-6 flex items-start justify-center">
        <div className="text-amber-950/70 flex items-end" style={{ fontFamily: "cursive" }}>
          <div className="mb-4 text-8xl font-bold">1</div>
          <div className="mb-4 text-4xl font-bold">/3</div>
        </div>
      </div>

      {/* Left middle - peach circle */}
      <div className="absolute -left-24 top-80 h-[240px] w-[240px] rounded-full bg-linear-to-br  from-[#2DB1C8] to-[#BAD56E] opacity-30" />

      <svg
        className="absolute left-0 top-40 h-[400px] w-full"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        <title>Decorative circle background</title>
        <circle cx="10" cy="200" r="100" stroke="#8B7355" strokeWidth="1.5" fill="none" />
      </svg>

      {/* Right bottom - large lavender circle */}
      <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-linear-to-br from-[#2DB1C8] to-[#BAD56E] opacity-30" />

      <svg
        className="absolute bottom-0 right-0 h-[600px] w-full"
        viewBox="0 0 400 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        <title>Decorative circle background</title>
        <circle cx="400" cy="320" r="200" stroke="#8B7355" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}
