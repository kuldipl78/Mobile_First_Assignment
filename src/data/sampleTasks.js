export const sampleTasks = [
  
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
