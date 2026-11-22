import { useState } from 'react'
import { focusNotes } from '../data/sampleTasks'
import { CheckIcon, ChevronIcon, ClockIcon } from './Icons'

export default function FocusNotes() {
  const [active, setActive] = useState(0)
  const slide = focusNotes[active]
  const total = focusNotes.length

  function show(index) {
    const next = (index + total) % total
    setActive(next)
  }

  function onKeyDown(event) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      show(active + 1)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      show(active - 1)
    }
  }

  return (
    <section
      className="notes"
      aria-roledescription="carousel"
      aria-label="Focus notes"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="notes-copy">
        <p className="notes-kicker">
          Focus notes
          <span>{slide.index}</span>
        </p>
        <h2 id={`note-${slide.id}`}>{slide.title}</h2>
        <p>{slide.body}</p>
        <div className="notes-bars" role="tablist" aria-label="Choose a focus note">
          {focusNotes.map((note, index) => (
            <button
              key={note.id}
              type="button"
              role="tab"
              className={index === active ? 'is-active' : undefined}
              aria-selected={index === active}
              aria-controls={`note-${note.id}`}
              tabIndex={index === active ? 0 : -1}
              onClick={() => show(index)}
            >
              <span className="sr-only">Note {index + 1}</span>
            </button>
          ))}
        </div>
      </div>

      <article className={`next-card tone-${slide.tone}`} aria-live="polite">
        <span className={`next-mark tone-${slide.tone}`}>
          {slide.tone === 'progress' ? <ClockIcon /> : <CheckIcon />}
        </span>
        <div>
          <p className="next-label">{slide.cardLabel}</p>
          <p className="next-title">{slide.cardTitle}</p>
          <div className="meter" aria-hidden="true">
            <span style={{ width: `${slide.progress}%` }} />
          </div>
        </div>
        <p className="next-percent">{slide.progress}%</p>
      </article>

      <div className="notes-nav">
        <button type="button" className="nav-btn ghost" onClick={() => show(active - 1)} aria-label="Previous focus note">
          <ChevronIcon direction="left" />
        </button>
        <button type="button" className="nav-btn solid" onClick={() => show(active + 1)} aria-label="Next focus note">
          <ChevronIcon direction="right" />
        </button>
      </div>
    </section>
  )
}
