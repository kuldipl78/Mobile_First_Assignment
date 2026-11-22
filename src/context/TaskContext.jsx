import { useEffect, useMemo, useReducer } from 'react'
import { sampleTasks } from '../data/sampleTasks'
import { TaskContext } from './task-context'

const STORAGE_KEY = 'focusboard.tasks'

function isTask(value) {
  if (!value || typeof value !== 'object') return false
  const statuses = ['todo', 'in-progress', 'completed']
  const priorities = ['high', 'medium', 'low']
  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    typeof value.category === 'string' &&
    statuses.includes(value.status) &&
    priorities.includes(value.priority) &&
    typeof value.dueDate === 'string'
  )
}

function readStoredTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed.filter(isTask)
  } catch {
    return null
  }
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'add':
      return [action.task, ...tasks]
    case 'update':
      return tasks.map((task) =>
        task.id === action.task.id ? { ...task, ...action.task } : task,
      )
    case 'delete':
      return tasks.filter((task) => task.id !== action.id)
    case 'set-status':
      return tasks.map((task) =>
        task.id === action.id ? { ...task, status: action.status } : task,
      )
    default:
      return tasks
  }
}

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `task-${Date.now()}`
}

export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, null, () => {
    const stored = readStoredTasks()
    return stored === null ? sampleTasks : stored
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // Private mode or a full disk should not break the board.
    }
  }, [tasks])

  const stats = useMemo(() => {
    const total = tasks.length
    const inProgress = tasks.filter((task) => task.status === 'in-progress').length
    const completed = tasks.filter((task) => task.status === 'completed').length
    const completion = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { total, inProgress, completed, completion }
  }, [tasks])

  const api = useMemo(
    () => ({
      tasks,
      stats,
      addTask(task) {
        dispatch({ type: 'add', task: { ...task, id: createId() } })
      },
      updateTask(task) {
        dispatch({ type: 'update', task })
      },
      deleteTask(id) {
        dispatch({ type: 'delete', id })
      },
      setStatus(id, status) {
        dispatch({ type: 'set-status', id, status })
      },
    }),
    [tasks, stats],
  )

  return <TaskContext.Provider value={api}>{children}</TaskContext.Provider>
}
