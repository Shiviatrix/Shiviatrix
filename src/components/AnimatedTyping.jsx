import { useEffect, useMemo, useState } from 'react'

const AnimatedTyping = ({
  lines = [],
  speed = 28,
  delayBetween = 600,
  className = '',
  onComplete,
}) => {
  const safeLines = useMemo(() => lines.filter(Boolean), [lines])
  const [displayed, setDisplayed] = useState(() => safeLines.map(() => ''))
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    setDisplayed(safeLines.map(() => ''))
    setLineIndex(0)
    setCharIndex(0)
  }, [safeLines])

  useEffect(() => {
    if (!safeLines.length) return
    if (lineIndex >= safeLines.length) {
      onComplete?.()
      return
    }

    const currentLine = safeLines[lineIndex]

    if (charIndex <= currentLine.length) {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => {
          const next = [...prev]
          next[lineIndex] = currentLine.slice(0, charIndex + 1)
          return next
        })
        setCharIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    }

    const pause = setTimeout(() => {
      setLineIndex((prev) => prev + 1)
      setCharIndex(0)
    }, delayBetween)

    return () => clearTimeout(pause)
  }, [charIndex, lineIndex, safeLines, speed, delayBetween, onComplete])

  return (
    <div className={`space-y-2 text-sm text-cyan-100 ${className}`}>
      {displayed.map((line, idx) => (
        <p
          key={`boot-line-${idx}`}
          className="tracking-tight text-slate-100/90"
          aria-live="polite"
        >
          {line}
          {lineIndex === idx && charIndex <= safeLines[idx].length && (
            <span className="ml-1 inline-block animate-cursor-blink text-accent">█</span>
          )}
        </p>
      ))}
    </div>
  )
}

export default AnimatedTyping
