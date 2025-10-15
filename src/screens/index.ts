// 3. Features:
// • Add New To-Do Item: Allow the user to add a new to-do item with all
// required fields.
// • Sort Items: Implement a feature to sort tasks within a category by
// priority (High → Low).
// • Mark as Completed: Add functionality to mark a task as completed,
// moving it to a “Completed Tasks” section.
// • Delete Items: Allow tasks to be deleted.
// 4. Data Persistence:
// • Store the to-do list and completed tasks locally using Ionic Storage or
// LocalStorage.
// 5. Logic Assessment:
// • The app should:
// • Dynamically group tasks by category.
// • Sort tasks by priority correctly.
// • Ensure completed tasks are removed from active lists and
// displayed separately.
// 6. Navigation:
// • Use Angular Router for navigation:
// • /login for the login screen.
// • /dashboard for the categorized to-do list.
// 7. Optional:
// • Add a search bar to filter tasks by title or description.
// • Allow tasks to be edited after creation.

'use client';

export * from './Login';
export * from './AddProduct';
export * from './ProductList';
export * from './ProductDetails';