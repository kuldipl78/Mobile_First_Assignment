import { useEffect, useId, useRef, useState } from 'react'
import { categories, priorities, statuses } from '../data/sampleTasks'

const emptyTask = {
  title: '',
  description: '',
  category: 'Design',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
}

export default function TaskForm({ task, onClose, onSubmit }) {
  const titleId = useId()
  const errorId = useId()
  const dialogRef = useRef(null)
  const [draft, setDraft] = useState(() => (task ? { ...task } : emptyTask))
  const [error, setError] = useState('')
  const isEdit = Boolean(task)

  useEffect(() => {
    const previous = document.activeElement
    dialogRef.current?.querySelector('input, select, textarea, button')?.focus()

    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [onClose])

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }))
    if (field === 'title' && error) setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const title = draft.title.trim()
    if (!title) {
      setError('Add a title so you can find this task later.')
      return
    }

    onSubmit({
      ...draft,
      title,
      description: draft.description.trim(),
    })
  }

  return (
    <div className="overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <div
        ref={dialogRef}
        className="dialog form-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
      >
        <header className="form-head">
          <div>
            <h2 id="task-form-title">{isEdit ? 'Edit task' : 'Create new task'}</h2>
            <p>{isEdit ? 'Update the details and save when you are ready.' : 'Add your task details to stay on top of your work.'}</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor={titleId}>
            Task title <span aria-hidden="true">*</span>
          </label>
          <input
            id={titleId}
            type="text"
            value={draft.title}
            placeholder="e.g. Update pricing page"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => update('title', event.target.value)}
          />
          {error ? (
            <p id={errorId} className="field-error" role="alert">
              {error}
            </p>
          ) : null}

          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            rows={4}
            value={draft.description}
            placeholder="Add notes about this task..."
            onChange={(event) => update('description', event.target.value)}
          />

          <label htmlFor="task-category">Category</label>
          <select
            id="task-category"
            value={draft.category}
            onChange={(event) => update('category', event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <div className="form-split">
            <div>
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                value={draft.status}
                onChange={(event) => update('status', event.target.value)}
              >
                {statuses.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={draft.priority}
                onChange={(event) => update('priority', event.target.value)}
              >
                {priorities.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label htmlFor="task-due">Due date</label>
          <input
            id="task-due"
            type="date"
            value={draft.dueDate}
            onChange={(event) => update('dueDate', event.target.value)}
          />

          <p className="required-note">* Required field</p>

          <div className="form-actions">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              {isEdit ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
