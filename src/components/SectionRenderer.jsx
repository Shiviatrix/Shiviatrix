import { Fragment } from 'react'

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
  {
    label: 'LinkedIn',
    value: 'https://www.linkedin.com/in/akshit-sivaraman-0b32b5370/',
  },
  {
    label: 'GitHub',
    value: 'https://github.com/Shiviatrix',
  },
]

const BitsPanel = ({ children, className = '' }) => (
  <div
    className={`rounded-2xl border border-slate-700/80 bg-panel/90 p-5 shadow-[0_0_30px_rgba(0,255,242,0.08)] backdrop-blur-xl ${className}`}
  >
    {children}
  </div>
)

const BitsCard = ({ children, className = '' }) => (
  <div
    className={`rounded-xl border border-slate-700/70 bg-black/40 p-4 shadow-[0_0_20px_rgba(0,255,242,0.05)] ${className}`}
  >
    {children}
  </div>
)

const SectionDivider = () => (
  <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-slate-500/40 to-transparent" />
)

const SectionRenderer = ({ sectionKey }) => {
  if (!sectionKey) {
    return (
      <p className="text-sm text-slate-300/80">
        Awaiting input... try <span className="text-accent font-semibold">help</span>.
      </p>
    )
  }

  return (
    <BitsPanel>
      <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{SECTION_LABELS[sectionKey]}</p>
      <p className="font-mono text-[0.65rem] tracking-[0.5em] text-slate-500/80">────────────────────────────</p>
      <SectionDivider />
      {sectionKey === 'about' && (
        <div className="space-y-3 text-sm text-slate-200/90">
          <p>first-year || BTech Computer Science Engineering</p>
          <p>Research in math, physics and computer science</p>
          <p>SNU Math Society || SNUphoria (music club) || SNU Chess</p>
        </div>
      )}

      {sectionKey === 'projects' && (
        <div className="grid gap-4">
          {PROJECTS.map((project) => (
            <BitsCard key={project.title}>
              <p className="font-semibold text-limeAccent text-sm">{project.title}</p>
              <p className="mt-2 text-sm text-slate-200/80">{project.desc}</p>
            </BitsCard>
          ))}
        </div>
      )}

      {sectionKey === 'research' && (
        <div className="space-y-4">
          {RESEARCH.map((entry, index) => (
            <Fragment key={entry.title}>
              <p className="text-base font-semibold text-accent">{entry.title}</p>
              <p className="text-sm text-slate-200/85">{entry.desc}</p>
              {index < RESEARCH.length - 1 && <SectionDivider />}
            </Fragment>
          ))}
        </div>
      )}

      {sectionKey === 'contact' && (
        <div className="space-y-4 text-sm text-slate-100">
          {CONTACTS.map((item) => (
            <p key={item.label}>
              <span className="text-limeAccent">{item.label}:</span>{' '}
              <a href={item.value} target="_blank" rel="noreferrer" className="underline decoration-dotted">
                {item.value}
              </a>
            </p>
          ))}
        </div>
      )}
    </BitsPanel>
  )
}

export default SectionRenderer
