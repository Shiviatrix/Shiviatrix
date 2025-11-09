import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import AnimatedTyping from './AnimatedTyping'
import SectionRenderer from './SectionRenderer'

const BOOT_LINES = [
  'booting AkshitOS...',
  'initializing modules: [engineering] [math] [physics] [code]',
  'system ready.',
  "type 'help' for available commands.",
]

const COMMANDS = [
  { key: 'about', display: '1 / about', description: 'About section', aliases: ['1', 'about'] },
  { key: 'projects', display: '2 / projects', description: 'Projects section', aliases: ['2', 'projects'] },
  { key: 'research', display: '3 / research', description: 'Research section', aliases: ['3', 'research'] },
  { key: 'contact', display: '4 / contact', description: 'Contact section', aliases: ['4', 'contact'] },
]

const COMMAND_ALIASES = COMMANDS.reduce((acc, command) => {
  command.aliases.forEach((alias) => {
    acc[alias] = command.key
  })
  return acc
}, {})

const Terminal = () => {
  const [bootComplete, setBootComplete] = useState(false)
  const [history, setHistory] = useState([])
  const [sectionKey, setSectionKey] = useState(null)
  const [sectionNonce, setSectionNonce] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [commandStack, setCommandStack] = useState([])
  const [stackIndex, setStackIndex] = useState(-1)

  const scrollRef = useRef(null)
  const hiddenInputRef = useRef(null)

  const helpLines = useMemo(
    () => [
      ...COMMANDS.map((command) => `${command.display} → ${command.description}`),
      'help → Show command list',
      'clear → Clear the terminal',
    ],
    [],
  )

  const focusPrompt = useCallback(() => {
    if (!hiddenInputRef.current || hiddenInputRef.current.disabled) return
    hiddenInputRef.current.focus()
  }, [])

  useEffect(() => {
    focusPrompt()
  }, [focusPrompt, bootComplete])

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [history, sectionKey, sectionNonce])

  const appendHistory = useCallback((entry) => {
    setHistory((prev) => [
      ...prev,
      {
        ...entry,
        id: `${entry.type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      },
    ])
  }, [])

  const handleCommandExecution = useCallback(
    (rawValue) => {
      const value = rawValue.trim()
      if (!value) return

      const normalized = value.toLowerCase()

      setCommandStack((prev) => [...prev, value])
      setStackIndex(-1)
      appendHistory({ type: 'command', text: value })

      if (!bootComplete) {
        appendHistory({ type: 'system', text: 'boot sequence incomplete. stand by...' })
        return
      }

      if (normalized === 'help') {
        appendHistory({ type: 'help', payload: helpLines })
        return
      }

      if (normalized === 'clear') {
        setHistory([])
        setSectionKey(null)
        setSectionNonce((nonce) => nonce + 1)
        return
      }

      const targetSection = COMMAND_ALIASES[normalized]
      if (targetSection) {
        appendHistory({
          type: 'system',
          text: `opening channel → ${targetSection.toUpperCase()}`,
        })
        setSectionKey(targetSection)
        setSectionNonce((nonce) => nonce + 1)
        return
      }

      appendHistory({
        type: 'error',
        text: "command not found: try 'help'",
      })
    },
    [appendHistory, bootComplete, helpLines],
  )

  const handleSubmit = useCallback(
    (event) => {
      event?.preventDefault()
      if (!inputValue.trim()) return
      handleCommandExecution(inputValue)
      setInputValue('')
    },
    [handleCommandExecution, inputValue],
  )

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        handleSubmit()
        return
      }

      if (!commandStack.length) return

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        const nextIndex = stackIndex < 0 ? commandStack.length - 1 : Math.max(stackIndex - 1, 0)
        if (nextIndex >= 0) {
          setStackIndex(nextIndex)
          setInputValue(commandStack[nextIndex])
        }
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (stackIndex < 0) return
        const nextIndex = stackIndex + 1
        if (nextIndex < commandStack.length) {
          setStackIndex(nextIndex)
          setInputValue(commandStack[nextIndex])
        } else {
          setStackIndex(-1)
          setInputValue('')
        }
      }
    },
    [commandStack, handleSubmit, stackIndex],
  )

  const renderHistoryEntry = (entry) => {
    switch (entry.type) {
      case 'command':
        return (
          <div key={entry.id} className="text-limeAccent/90">
            <span className="text-accent">akshitos@core</span>
            <span className="mx-2 text-slate-500">~$</span>
            {entry.text}
          </div>
        )
      case 'system':
        return (
          <div key={entry.id} className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {entry.text}
          </div>
        )
      case 'error':
        return (
          <div key={entry.id} className="text-[#ff8f8f]">
            {entry.text}
          </div>
        )
      case 'help':
        return (
          <div key={entry.id} className="text-sm text-slate-200/80">
            <p className="text-accent">available commands:</p>
            <div className="mt-2 space-y-1">
              {entry.payload?.map((line) => (
                <p key={line} className="font-mono tracking-tight text-slate-200/80">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative w-full max-w-4xl rounded-[32px] border border-slate-800/80 bg-gradient-to-br from-panel/90 via-panel/70 to-black/50 p-6 text-sm shadow-[0px_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-3xl">
      <div className="pointer-events-none absolute inset-px rounded-[30px] border border-white/5 opacity-70" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-r from-transparent via-accent/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-6 animate-scan-sweep rounded-[24px] bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-30" />

      <div className="relative z-10 flex flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/50 pb-4">
          <div className="flex items-center gap-3">
            <img
              src="/pfp.jpg"
              alt="Akshit avatar"
              className="h-12 w-12 rounded-full border border-white/10 object-cover opacity-70"
            />
            <div>
              <p className="text-lg font-semibold text-white">Akshit Sivaraman</p>
              <p className="text-xs text-slate-300">engineering && math && physics && code</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-limeAccent">
              <span className="h-2 w-2 animate-pulse rounded-full bg-limeAccent drop-shadow-[0_0_6px_rgba(168,255,96,0.9)]" />
              ONLINE
            </span>
            <span className="text-slate-400">v1.0.0</span>
          </div>
        </header>

        <div className="relative flex flex-col gap-6">
          <div
            ref={scrollRef}
            className="custom-scrollbar flex max-h-[55vh] flex-col gap-5 overflow-y-auto pr-2 text-slate-100/90"
          >
            <AnimatedTyping
              lines={BOOT_LINES}
              speed={26}
              delayBetween={500}
              onComplete={() => setBootComplete(true)}
              className="font-mono text-[0.92rem]"
            />

            <div className={clsx('flex flex-col gap-3', { 'opacity-40 grayscale': !bootComplete })}>
              {history.map((entry) => renderHistoryEntry(entry))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${sectionKey || 'idle'}-${sectionNonce}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <SectionRenderer sectionKey={sectionKey} />
              </motion.div>
            </AnimatePresence>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative flex items-center gap-3 rounded-2xl border border-slate-700/70 bg-black/40 px-4 py-3 font-mono text-base text-white shadow-inner shadow-black/40"
            onClick={focusPrompt}
          >
            <div className="text-accent">akshitos@core</div>
            <div className="text-slate-500">~$</div>
            <div className="relative flex-1">
              <div className="min-h-[1.5rem] pr-6 text-slate-50">
                {inputValue.length > 0 ? (
                  inputValue
                ) : (
                  <span className="text-slate-500">{bootComplete ? 'enter command...' : 'booting...'}</span>
                )}
                <span className="ml-1 inline-block text-accent drop-shadow-[0_0_6px_rgba(0,255,242,0.8)] animate-cursor-blink">
                  █
                </span>
              </div>
              <input
                ref={hiddenInputRef}
                type="text"
                className="absolute inset-0 h-full w-full cursor-text bg-transparent text-transparent caret-transparent opacity-0"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Terminal command input"
                autoComplete="off"
                spellCheck={false}
                disabled={!bootComplete}
              />
            </div>
            <button
              type="submit"
              className="rounded-xl border border-accent/20 bg-accent/10 px-3 py-1 text-xs uppercase tracking-widest text-accent transition hover:border-accent/70 hover:bg-accent/20 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!bootComplete}
            >
              EXEC
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Terminal
