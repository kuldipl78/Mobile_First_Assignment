export const sampleTasks = [
  {
    id: 'task-design-landing',
    title: 'Design landing page',
    description: 'Website redesign · Due soon',
    category: 'Design',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-11-22',
  },
  {
    id: 'task-mobile-nav',
    title: 'Fix mobile navigation',
    description: 'Frontend sprint · UI polish',
    category: 'Development',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2026-11-24',
  },
  {
    id: 'task-onboarding-copy',
    title: 'Review onboarding copy',
    description: 'Content updates · Approved',
    category: 'Content',
    status: 'completed',
    priority: 'low',
    dueDate: '2026-11-18',
  },
  {
    id: 'task-sprint-retro',
    title: 'Prepare sprint retro',
    description: 'Notes for Friday’s review',
    category: 'Development',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2026-11-26',
  },
  {
    id: 'task-pricing-page',
    title: 'Update pricing page',
    description: 'Marketing site refresh',
    category: 'Design',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-11-28',
  },
  {
    id: 'task-release-notes',
    title: 'Write release notes',
    description: 'Ship notes for version 1.4',
    category: 'Content',
    status: 'completed',
    priority: 'low',
    dueDate: '2026-11-15',
  },
  {
    id: 'task-checkout-qa',
    title: 'QA checkout flow',
    description: 'Payment edge cases',
    category: 'Development',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-11-27',
  },
  {
    id: 'task-interviews',
    title: 'Schedule interviews',
    description: 'Talk with three recent users',
    category: 'Research',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2026-11-25',
  },
]

export const focusNotes = [
  {
    id: 'note-today',
    index: '01 / 03',
    title: 'Make today count.',
    body: 'A little focus goes a long way.',
    cardLabel: 'Next up',
    cardTitle: 'Design landing page',
    progress: 62,
    tone: 'next',
  },
  {
    id: 'note-steps',
    index: '02 / 03',
    title: 'Small steps, big progress.',
    body: 'Keep your workflow in flow.',
    cardLabel: 'In progress',
    cardTitle: 'Fix navigation',
    progress: 48,
    tone: 'progress',
  },
  {
    id: 'note-wins',
    index: '03 / 03',
    title: 'Celebrate the wins.',
    body: 'Every completed task moves you forward.',
    cardLabel: 'Done',
    cardTitle: 'Onboarding copy',
    progress: 100,
    tone: 'done',
  },
]

export const categories = ['Design', 'Development', 'Content', 'Research']

export const statuses = [
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
]

export const priorities = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export function formatDueDate(isoDate) {
  if (!isoDate) return 'No date'
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return 'No date'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
