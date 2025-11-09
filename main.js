const BOOT_LINES = [
  'booting AkshitOS...',
  'initializing modules: [engineering] [math] [physics] [code]',
  'system ready.',
  "type 'help' for available commands.",
]

const COMMANDS = [
  { key: 'about', aliases: ['1', 'about'], description: 'About section' },
  { key: 'projects', aliases: ['2', 'projects'], description: 'Projects section' },
  { key: 'research', aliases: ['3', 'research'], description: 'Research section' },
  { key: 'contact', aliases: ['4', 'contact'], description: 'Contact section' },
]

const SECTION_LABELS = {
  about: '---[ ABOUT ]---',
  projects: '---[ PROJECTS ]---',
  research: '---[ RESEARCH LOGS ]---',
  contact: '---[ CONTACT NODE ]---',
}

const PROJECTS = [
  {
    title: '2D Physics Engine (JavaScript)',
    desc:
      'Custom modular physics engine supporting circles, boxes, and polygons with SAT collision and torque dynamics.',
  },
  {
    title: 'Women’s Safety Web App',
    desc: 'Firebase-based SOS alert and notification platform built for real-time safety communication.',
  },
  {
    title: 'Quantum Prisoner’s Dilemma Bot',
    desc:
      'Adaptive game-theory bot using true quantum vacuum RNG from ANU’s Quantum Random Number Generator API. Built during PING Hackathon (GDG SNU).',
  },
  {
    title: 'Zeta Function Simulator (Python)',
    desc: 'Phasor-chain visualization of ζ(s). (Currently under review, not shown in research section)',
  },
]

const RESEARCH = [
  {
    title: 'Emergence of 2D Particle Life from Asymmetric Interactions',
    desc:
      'Computational study on emergent lifelike structures using Ventrella-style particle clusters and local asymmetric rules.',
  },
]

const CONTACTS = [
  { label: 'LinkedIn', value: 'https://www.linkedin.com/in/akshit-sivaraman-0b32b5370/' },
  { label: 'GitHub', value: 'https://github.com/Shiviatrix' },
]

const COMMAND_LOOKUP = COMMANDS.reduce((map, command) => {
  command.aliases.forEach((alias) => {
    map[alias] = command.key
  })
  return map
}, {})

const helpLines = [
  ...COMMANDS.map((command) => `${command.aliases.join(' / ')} → ${command.description}`),
  'help → Show command list',
  'clear → Clear the terminal',
]

const scrollRegion = document.querySelector('[data-terminal-scroll]')
const bootContainer = document.querySelector('[data-boot]')
const historyContainer = document.querySelector('[data-history]')
const sectionRegion = document.querySelector('[data-section]')
const promptDisplay = document.querySelector('[data-prompt-display]')
const promptInput = document.querySelector('[data-prompt-input]')
const promptForm = document.querySelector('[data-form]')
const actionButton = promptForm.querySelector('.prompt-action')
const particleField = document.querySelector('[data-particles]')

let bootComplete = false
let commandStack = []
let stackIndex = -1
let currentSection = null

const updatePromptDisplay = () => {
  const text = promptInput.value || (bootComplete ? 'enter command...' : 'booting...')
  promptDisplay.textContent = ''
  const textNode = document.createTextNode(text)
  promptDisplay.appendChild(textNode)
  const cursor = document.createElement('span')
  cursor.className = 'cursor'
  cursor.textContent = '█'
  promptDisplay.appendChild(cursor)
}

const addParticleNodes = () => {
  if (!particleField) return
  const count = 18
  for (let i = 0; i < count; i += 1) {
    const node = document.createElement('span')
    node.style.left = `${(i * 37) % 100}%`
    node.style.top = `${(i * 53) % 100}%`
    node.style.animationDelay = `${i * 0.35}s`
    particleField.appendChild(node)
  }
}

const appendHistoryEntry = (entry) => {
  const container = document.createElement('div')
  container.className = `history-entry ${entry.type || ''}`

  switch (entry.type) {
    case 'command': {
      container.innerHTML = `<span class="accent">akshitos@core</span><span class="path">~$</span>${entry.text}`
      break
    }
    case 'system': {
      container.textContent = entry.text
      break
    }
    case 'error': {
      container.textContent = entry.text
      break
    }
    case 'help': {
      const label = document.createElement('p')
      label.className = 'help-block'
      label.innerHTML = '<strong>available commands:</strong>'
      const list = document.createElement('ul')
      list.className = 'help-list'
      entry.payload.forEach((line) => {
        const item = document.createElement('li')
        item.textContent = line
        list.appendChild(item)
      })
      container.appendChild(label)
      container.appendChild(list)
      break
    }
    default:
      container.textContent = entry.text
  }

  historyContainer.appendChild(container)
  scrollRegion.scrollTo({ top: scrollRegion.scrollHeight, behavior: 'smooth' })
}

const createDivider = () => {
  const divider = document.createElement('div')
  divider.className = 'divider'
  return divider
}

const renderSection = (sectionKey) => {
  sectionRegion.classList.remove('show')
  sectionRegion.innerHTML = ''

  const sectionContainer = document.createElement('div')
  sectionContainer.className = 'section-panel'

  if (!sectionKey) {
    const emptyState = document.createElement('p')
    emptyState.className = 'section-empty'
    emptyState.innerHTML = "Awaiting input... try <span>help</span>."
    sectionRegion.appendChild(emptyState)
    requestAnimationFrame(() => sectionRegion.classList.add('show'))
    return
  }

  const label = document.createElement('p')
  label.className = 'section-label'
  label.textContent = SECTION_LABELS[sectionKey]
  sectionContainer.appendChild(label)

  const ascii = document.createElement('p')
  ascii.className = 'section-ascii'
  ascii.textContent = '────────────────────────────'
  sectionContainer.appendChild(ascii)
  sectionContainer.appendChild(createDivider())

  if (sectionKey === 'about') {
    const list = document.createElement('div')
    list.className = 'section-copy'
    list.innerHTML = `
      <p>first-year || BTech Computer Science Engineering</p>
      <p>Research in math, physics and computer science</p>
      <p>SNU Math Society || SNUphoria (music club) || SNU Chess</p>
    `
    sectionContainer.appendChild(list)
  }

  if (sectionKey === 'projects') {
    const grid = document.createElement('div')
    grid.className = 'project-grid'
    PROJECTS.forEach((project) => {
      const card = document.createElement('article')
      card.className = 'project-card'
      const title = document.createElement('p')
      title.className = 'title'
      title.textContent = project.title
      const desc = document.createElement('p')
      desc.textContent = project.desc
      card.appendChild(title)
      card.appendChild(desc)
      grid.appendChild(card)
    })
    sectionContainer.appendChild(grid)
  }

  if (sectionKey === 'research') {
    RESEARCH.forEach((entry, index) => {
      const wrapper = document.createElement('div')
      wrapper.className = 'research-entry'
      const title = document.createElement('h4')
      title.textContent = entry.title
      const desc = document.createElement('p')
      desc.textContent = entry.desc
      wrapper.appendChild(title)
      wrapper.appendChild(desc)
      sectionContainer.appendChild(wrapper)
      if (index < RESEARCH.length - 1) {
        sectionContainer.appendChild(createDivider())
      }
    })
  }

  if (sectionKey === 'contact') {
    const list = document.createElement('div')
    list.className = 'contact-list'
    CONTACTS.forEach((item) => {
      const row = document.createElement('p')
      const label = document.createElement('span')
      label.textContent = `${item.label}:`
      const link = document.createElement('a')
      link.href = item.value
      link.target = '_blank'
      link.rel = 'noreferrer'
      link.textContent = item.value
      row.appendChild(label)
      row.appendChild(link)
      list.appendChild(row)
    })
    sectionContainer.appendChild(list)
  }

  sectionRegion.appendChild(sectionContainer)
  requestAnimationFrame(() => sectionRegion.classList.add('show'))
}

const executeCommand = (value) => {
  const raw = value.trim()
  if (!raw) return

  const normalized = raw.toLowerCase()
  commandStack.push(raw)
  stackIndex = -1

  appendHistoryEntry({ type: 'command', text: raw })

  if (!bootComplete) {
    appendHistoryEntry({ type: 'system', text: 'boot sequence incomplete. stand by...' })
    return
  }

  if (normalized === 'help') {
    appendHistoryEntry({ type: 'help', payload: helpLines })
    return
  }

  if (normalized === 'clear') {
    historyContainer.innerHTML = ''
    currentSection = null
    renderSection(null)
    return
  }

  const target = COMMAND_LOOKUP[normalized]
  if (target) {
    appendHistoryEntry({ type: 'system', text: `opening channel → ${target.toUpperCase()}` })
    currentSection = target
    renderSection(target)
    return
  }

  appendHistoryEntry({ type: 'error', text: "command not found: try 'help'" })
}

const handleBootSequence = () => {
  let lineIndex = 0

  const typeLine = () => {
    if (lineIndex >= BOOT_LINES.length) {
      bootComplete = true
      promptInput.disabled = false
      actionButton.disabled = false
      updatePromptDisplay()
      promptInput.focus()
      renderSection(null)
      return
    }

    const text = BOOT_LINES[lineIndex]
    const lineEl = document.createElement('p')
    lineEl.className = 'boot-line'
    const cursor = document.createElement('span')
    cursor.className = 'cursor'
    cursor.textContent = '█'
    bootContainer.appendChild(lineEl)

    let charIndex = 0
    const typeChar = () => {
      if (charIndex <= text.length) {
        lineEl.textContent = text.slice(0, charIndex)
        lineEl.appendChild(cursor)
        charIndex += 1
        setTimeout(typeChar, 26)
      } else {
        cursor.remove()
        lineEl.textContent = text
        lineIndex += 1
        setTimeout(typeLine, 500)
      }
    }

    typeChar()
  }

  typeLine()
}

promptForm.addEventListener('click', () => {
  if (!promptInput.disabled) {
    promptInput.focus()
  }
})

promptInput.addEventListener('input', () => {
  updatePromptDisplay()
})

promptInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    promptForm.dispatchEvent(new Event('submit', { cancelable: true }))
    return
  }

  if (!commandStack.length) return

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    const nextIndex = stackIndex < 0 ? commandStack.length - 1 : Math.max(stackIndex - 1, 0)
    stackIndex = nextIndex
    promptInput.value = commandStack[nextIndex] || ''
    updatePromptDisplay()
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (stackIndex < 0) return
    const nextIndex = stackIndex + 1
    if (nextIndex < commandStack.length) {
      stackIndex = nextIndex
      promptInput.value = commandStack[nextIndex]
    } else {
      stackIndex = -1
      promptInput.value = ''
    }
    updatePromptDisplay()
  }
})

promptForm.addEventListener('submit', (event) => {
  event.preventDefault()
  if (!bootComplete) return

  const value = promptInput.value.trim()
  if (!value) return

  executeCommand(value)
  promptInput.value = ''
  updatePromptDisplay()
})

addParticleNodes()
updatePromptDisplay()
handleBootSequence()
