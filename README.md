# FocusBoard

A single-user task dashboard built with React and Vite, based on the FocusBoard Figma reference.

## State management

Tasks live in React Context with `useReducer` (`src/context/TaskContext.jsx`). Add, edit, delete, and status changes return a new array. Counts, completion percentage, and the filtered list are derived from that array. No third-party state library is used.

## What works

- Create a task. The title is required.
- Edit a task, or delete it after confirmation.
- Move a task between To do, In progress, and Completed.
- Search titles (case-insensitive), with status tabs and a priority filter applied together.
- Total, in progress, completed, and completion percentage come from the current tasks.
- Focus Notes has three slides with previous, next, and indicators.
- Changes are saved in `localStorage` (`focusboard.tasks`) and restored on refresh. Sample tasks load only when nothing is saved.

Calendar and Settings are placeholders from the design. There is no account or backend.

## Scripts

```bash
npm install
npm run dev
npm run build
```