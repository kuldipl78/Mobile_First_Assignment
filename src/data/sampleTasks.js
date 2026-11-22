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
