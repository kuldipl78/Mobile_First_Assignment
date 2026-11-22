import { useEffect, useRef } from 'react'

export default function ConfirmDialog({ title, message, confirmLabel, onConfirm, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const previous = document.activeElement
    dialogRef.current?.querySelector('button')?.focus()

    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [onClose])

  return (
    <div
      className="overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div ref={dialogRef} className="dialog confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-copy">
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-copy">{message}</p>
        <div className="form-actions">
          <button type="button" className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
