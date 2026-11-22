import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { formatDueDate, priorities, statuses } from '../data/sampleTasks'
import { CalendarIcon, CheckIcon, ClockIcon, DotsIcon, PlusIcon, SearchIcon } from './Icons'

const statusCycle = ['todo', 'in-progress', 'completed']

function nextStatus(status) {
  const index = statusCycle.indexOf(status)
  return statusCycle[(index + 1) % statusCycle.length]
}

function statusLabel(status) {
  return statuses.find((item) => item.value === status)?.label ?? status
}

export default function TaskBoard({ tasks, onCreate, onEdit, onDelete, onStatus }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [openMenuId, setOpenMenuId] = useState(null)
  const listRef = useRef(null)
  const closeMenu = useCallback(() => setOpenMenuId(null), [])

  const needle = query.trim().toLowerCase()
  const searched = tasks.filter((task) => task.title.toLowerCase().includes(needle))
  const matched = searched.filter((task) => priority === 'all' || task.priority === priority)
  const counts = {
    all: matched.length,
    'in-progress': matched.filter((task) => task.status === 'in-progress').length,
    completed: matched.filter((task) => task.status === 'completed').length,
  }
  const visible = matched.filter((task) => status === 'all' || task.status === status)

  function resetFilters() {
    setQuery('')
    setStatus('all')
    setPriority('all')
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="tasks" id="tasks" ref={listRef}>
      <header className="tasks-head">
        <div>
          <h2>My tasks</h2>
          <p className="lede-desktop">Manage and track everything in one place.</p>
          <p className="lede-mobile">Your priorities for this week</p>
        </div>
        <button type="button" className="text-btn desktop-only" onClick={resetFilters}>
          View all tasks
        </button>
        <button type="button" className="plus-btn mobile-only" onClick={onCreate} aria-label="New task">
          <PlusIcon />
        </button>
      </header>

      <div className="toolbar">
        <div className="tabs" role="tablist" aria-label="Filter by status">
          <button type="button" role="tab" aria-selected={status === 'all'} className={status === 'all' ? 'is-active' : undefined} onClick={() => setStatus('all')}>
            All tasks {counts.all}
          </button>
          <button type="button" role="tab" aria-selected={status === 'in-progress'} className={status === 'in-progress' ? 'is-active' : undefined} onClick={() => setStatus('in-progress')}>
            In progress
          </button>
          <button type="button" role="tab" aria-selected={status === 'completed'} className={status === 'completed' ? 'is-active' : undefined} onClick={() => setStatus('completed')}>
            Completed
          </button>
        </div>

        <label className="search">
          <span className="sr-only">Search tasks by title</span>
          <SearchIcon />
          <input
            type="search"
            placeholder="Find a task..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <label className="priority-filter">
          <span className="sr-only">Filter by priority</span>
          <select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="all">Priority: All</option>
            {priorities.map((item) => (
              <option key={item.value} value={item.value}>
                Priority: {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? 'task' : 'tasks'} shown
      </p>

      {visible.length === 0 ? (
        <div className="empty">
          <p>No tasks match this search.</p>
          <button type="button" className="text-btn" onClick={resetFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="task-list">
          {visible.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              menuOpen={openMenuId === task.id}
              onToggleMenu={() => setOpenMenuId((current) => (current === task.id ? null : task.id))}
              onCloseMenu={closeMenu}
              onEdit={() => {
                setOpenMenuId(null)
                onEdit(task)
              }}
              onDelete={() => {
                setOpenMenuId(null)
                onDelete(task)
              }}
              onStatus={(next) => onStatus(task.id, next)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function TaskRow({ task, menuOpen, onToggleMenu, onCloseMenu, onEdit, onDelete, onStatus }) {
  const menuId = useId()
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return undefined

    function onPointerDown(event) {
      if (!menuRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
        onCloseMenu()
      }
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') onCloseMenu()
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen, onCloseMenu])

  const upcoming = nextStatus(task.status)

  return (
    <li className={`task-row is-${task.status}`}>
      <button
        type="button"
        className={`status-btn is-${task.status}`}
        aria-label={`${task.title} is ${statusLabel(task.status)}. Mark as ${statusLabel(upcoming)}.`}
        onClick={() => onStatus(upcoming)}
      >
        {task.status === 'completed' ? <CheckIcon /> : null}
        {task.status === 'in-progress' ? <ClockIcon /> : null}
      </button>

      <div className="task-copy">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
      </div>

      <div className="task-meta">
        <span className={`pill category-${task.category.toLowerCase()}`}>{task.category}</span>
        <span className={`pill priority-${task.priority}`}>{priorityLabel(task.priority)}</span>
        <span className="due">
          <CalendarIcon />
          {formatDueDate(task.dueDate)}
        </span>
      </div>

      <div className="menu-wrap">
        <button
          ref={buttonRef}
          type="button"
          className="icon-btn"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={`Actions for ${task.title}`}
          onClick={onToggleMenu}
        >
          <DotsIcon />
        </button>
        {menuOpen ? (
          <div ref={menuRef} id={menuId} className="menu" role="menu">
            <button type="button" role="menuitem" onClick={onEdit}>
              Edit task
            </button>
            {statuses.map((item) => (
              <button
                key={item.value}
                type="button"
                role="menuitem"
                onClick={() => {
                  onStatus(item.value)
                  onCloseMenu()
                }}
                disabled={item.value === task.status}
              >
                Mark {item.label.toLowerCase()}
              </button>
            ))}
            <button type="button" role="menuitem" className="danger" onClick={onDelete}>
              Delete task
            </button>
          </div>
        ) : null}
      </div>
    </li>
  )
}

function priorityLabel(priority) {
  return priorities.find((item) => item.value === priority)?.label ?? priority
}
