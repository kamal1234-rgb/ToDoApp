# ToDoApp Project

## Project Overview
- This is a React Native To-Do app with authentication, task categorization, and local data storage.
- Key features: login, dashboard with categorized tasks (Work, Personal, Urgent), add/edit/delete tasks, mark as completed, and persistent storage.

## Architecture & Key Files
- Main entry: `App.tsx` and `src/Main.tsx`.
- Screens: `src/screens/` (e.g., `TaskList.tsx`, `TaskDetails.tsx`, `Login.tsx`, `Splash.tsx`).
- Components: `src/components/` (e.g., `TaskCategoryList.tsx`, `TaskTabs.tsx`, `CompletedList.tsx`).
- Data & hooks: `src/data/`, `src/hooks/` (e.g., `useTasks.ts` for task state management).
- Services: `src/services/APIManager.ts` handles API calls (login, etc.).
- Types: `src/types/index.ts` defines core types (Task, Category, etc.).
- Utilities: `src/utils/` for constants and helpers.

## Developer Workflows
- **Run app (Android):**
  - `npx react-native run-android`
- **Run app (iOS):**
  - `npx react-native run-ios`
- **Run tests:**
  - `npm test` (Jest, see `__tests__/App.test.tsx`)
- **Debug:**
  - Use React Native Debugger or VS Code debugger integration.

## Patterns & Conventions
- Tasks are grouped and displayed by category (Work, Personal, Urgent).
- Task objects include: title, description, priority, category, completed status.
- Local persistence uses AsyncStorage (not Ionic Storage, despite README).
- API integration uses `dummyjson.com` for authentication.
- UI state managed via hooks (`useTasks.ts`), not Redux.
- Navigation handled via React Navigation (see `src/navigation/`).
- All business logic for tasks (add, edit, complete, delete) is in hooks/components, not services.

## Integration Points
- External API: `https://dummyjson.com/auth/login` for login.
- Local storage: AsyncStorage (see helpers in `src/utils/`).

## Examples
- To add a new task, use the `AddEditProduct.tsx` component and update state via `useTasks.ts`.
- To persist tasks, use helper functions in `src/utils/helpers.ts`.
- To show completed tasks, use `CompletedList.tsx` and filter by `completed: true`.

## Special Notes
- Do not use Ionic Storage; use AsyncStorage for local persistence.
- Follow the category and priority grouping in UI as shown in `TaskCategoryList.tsx` and `TaskTabs.tsx`.
- All new features should integrate with the hooks-based state management.

---
_Review these instructions after major architectural changes or new feature additions._
