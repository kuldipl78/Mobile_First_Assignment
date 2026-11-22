import { CheckIcon, ClockIcon, ListIcon } from './Icons'

export default function Stats({ stats }) {
  const cards = [
    {
      key: 'total',
      label: 'Total tasks',
      value: stats.total,
      caption: 'Across all projects',
      icon: <ListIcon />,
    },
    {
      key: 'progress',
      label: 'In progress',
      value: stats.inProgress,
      caption: 'Keep the momentum',
      icon: <ClockIcon />,
    },
    {
      key: 'done',
      label: 'Completed',
      value: stats.completed,
      caption: 'Great work this week',
      icon: <CheckIcon />,
    },
  ]

  return (
    <section className="stats" aria-label="Task summary">
      <h2 className="section-label mobile-only">Overview</h2>
      <div className="stat-grid">
        {cards.map((card) => (
          <article key={card.key} className={`stat stat-${card.key}`}>
            <span className="stat-icon">{card.icon}</span>
            <p className="stat-label">{card.label}</p>
            <p className="stat-value">
              <strong>{card.value}</strong>
              <span>
                {card.key === 'done'
                  ? `${card.caption} · ${stats.completion}%`
                  : card.caption}
              </span>
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
