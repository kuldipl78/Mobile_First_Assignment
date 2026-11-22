import { useCallback, useEffect, useRef, useState } from 'react'
import { TaskProvider } from './context/TaskContext'
import { useTasks } from './hooks/useTasks'
import ConfirmDialog from './components/ConfirmDialog'
import FocusNotes from './components/FocusNotes'
import {
  CalendarIcon,
  CaretIcon,
  GridIcon,
  ListIcon,
  LogoMark,
  SettingsIcon,
} from './components/Icons'
import Stats from './components/Stats'
import TaskBoard from './components/TaskBoard'
import TaskForm from './components/TaskForm'

const navItems = [
  { id: 'overview', label: 'Overview', short: 'Overview', icon: GridIcon },
  { id: 'tasks', label: 'My tasks', short: 'Tasks', icon: ListIcon },
  { id: 'calendar', label: 'Calendar', short: 'Calendar', icon: CalendarIcon },
  { id: 'settings', label: 'Settings', short: 'Settings', icon: SettingsIcon },
]

export default function App() {
  return (
    <TaskProvider>
      <Dashboard />
    </TaskProvider>
  )
}

function Dashboard() {
  const { tasks, stats, addTask, updateTask, deleteTask, setStatus } = useTasks()
  const [screen, setScreen] = useState('overview')
  const [formTask, setFormTask] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const closeForm = useCallback(() => setFormOpen(false), [])
  const closeDelete = useCallback(() => setPendingDelete(null), [])

  useEffect(() => {
    if (!profileOpen) return undefined

    function onPointerDown(event) {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false)
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') setProfileOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [profileOpen])

  function openScreen(next) {
    setScreen(next)
    setProfileOpen(false)
    if (next === 'tasks') {
      window.requestAnimationFrame(() => {
        document.getElementById('tasks')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function openCreate() {
    setFormTask(null)
    setFormOpen(true)
  }

  function openEdit(task) {
    setFormTask(task)
    setFormOpen(true)
  }

  function saveTask(draft) {
    if (formTask) {
      updateTask({ ...draft, id: formTask.id })
    } else {
      addTask(draft)
    }
    setFormOpen(false)
    setScreen('overview')
  }

  const activeNav = screen === 'tasks' ? 'tasks' : screen

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <LogoMark />
          </span>
          <span>FocusBoard</span>
        </div>
        <p className="nav-label">Workspace</p>
        <nav aria-label="Workspace">
          {navItems.map((item) => {
            const Icon = item.icon
            const selected = activeNav === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={selected ? 'nav-item is-active' : 'nav-item'}
                aria-current={selected ? 'page' : undefined}
                onClick={() => openScreen(item.id)}
              >
                <Icon />
                {item.label}
              </button>
            )
          })}
        </nav>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="brand mobile-brand">
            <span className="brand-mark">
              <LogoMark />
            </span>
            <span>FocusBoard</span>
          </div>
          <p className="crumbs">
            <span className="crumb-pill">Workspace</span>
            <span aria-hidden="true">/</span>
            <span>{screen === 'overview' || screen === 'tasks' ? 'Overview' : titleFor(screen)}</span>
          </p>
          <div className="profile" ref={profileRef}>
            <button
              type="button"
              className="avatar-btn"
              aria-expanded={profileOpen}
              aria-haspopup="dialog"
              onClick={() => setProfileOpen((open) => !open)}
            >
              <span className="avatar" aria-hidden="true">JD</span>
              <CaretIcon />
              <span className="sr-only">Account menu</span>
            </button>
            {profileOpen ? (
              <div className="profile-card" role="dialog" aria-label="Account">
                <strong>Jordan D.</strong>
                <p>This board stays on this device. There is no account to sign in to.</p>
              </div>
            ) : null}
          </div>
        </header>

        <main>
          {screen === 'calendar' || screen === 'settings' ? (
            <Placeholder screen={screen} onBack={() => openScreen('overview')} />
          ) : (
            <>
              <section className="page-head">
                <div>
                  <h1>Your work, in focus.</h1>
                  <p className="lede-desktop">Plan your day, stay organized, and celebrate small wins.</p>
                  <p className="lede-mobile">Stay organized and keep moving forward.</p>
                </div>
                <button type="button" className="btn primary new-task" onClick={openCreate}>
                  New task
                </button>
              </section>

              <FocusNotes />
              <Stats stats={stats} />
              <TaskBoard
                tasks={tasks}
                onCreate={openCreate}
                onEdit={openEdit}
                onDelete={setPendingDelete}
                onStatus={setStatus}
              />
            </>
          )}
        </main>
      </div>

      <nav className="mobile-nav" aria-label="Workspace">
        {navItems.map((item) => {
          const Icon = item.icon
          const selected = activeNav === item.id
          return (
            <button
              key={item.id}
              type="button"
              className={selected ? 'is-active' : undefined}
              aria-current={selected ? 'page' : undefined}
              onClick={() => openScreen(item.id)}
            >
              <Icon />
              {item.short}
            </button>
          )
        })}
      </nav>

      {formOpen ? (
        <TaskForm
          task={formTask}
          onClose={closeForm}
          onSubmit={saveTask}
        />
      ) : null}

      {pendingDelete ? (
        <ConfirmDialog
          title="Delete this task?"
          message={`“${pendingDelete.title}” will be removed from this board. This only affects the copy saved in your browser.`}
          confirmLabel="Delete task"
          onClose={closeDelete}
          onConfirm={() => {
            deleteTask(pendingDelete.id)
            setPendingDelete(null)
          }}
        />
      ) : null}
    </div>
  )
}

function Placeholder({ screen, onBack }) {
  const copy = {
    calendar: {
      title: 'Calendar',
      body: 'A calendar view is not part of this board. Due dates still show on each task, and you can change them from the task form.',
    },
    settings: {
      title: 'Settings',
      body: 'There is nothing to configure yet. Tasks are saved in this browser, so a refresh keeps the work you have already added.',
    },
  }[screen]

  return (
    <section className="placeholder">
      <h1>{copy.title}</h1>
      <p>{copy.body}</p>
      <button type="button" className="btn primary" onClick={onBack}>
        Back to overview
      </button>
    </section>
  )
}

function titleFor(screen) {
  if (screen === 'calendar') return 'Calendar'
  if (screen === 'settings') return 'Settings'
  return 'Overview'
}
