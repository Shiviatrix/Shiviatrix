import Terminal from './components/Terminal'

const ParticleField = () => (
  <div className="pointer-events-none absolute inset-0 particle-field opacity-50">
    {Array.from({ length: 18 }).map((_, index) => (
      <span
        key={`particle-${index}`}
        style={{
          left: `${(index * 37) % 100}%`,
          top: `${(index * 53) % 100}%`,
          animationDelay: `${index * 0.35}s`,
        }}
      />
    ))}
  </div>
)

function App() {
  return (
    <div className="relative flex h-full min-h-screen w-full items-center justify-center bg-base text-slate-100">
      <div className="noise-overlay" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />
      <ParticleField />

      <div className="relative z-10 flex h-full w-full max-w-6xl flex-1 items-center justify-center px-4 py-8 sm:px-8">
        <Terminal />
      </div>
    </div>
  )
}

export default App
