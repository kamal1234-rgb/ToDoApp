# ToDoApp
Practical Task

📝 Project Summary

Build a Priority To-Do App with authentication, categorization, and local data storage using Angular and Ionic.

⚙️ Key Requirements

Authentication

Create a login screen using the mock API:
🔗 https://dummyjson.com/auth/login

On success → navigate to /dashboard

On failure → show an error message.

Dashboard

Show categorized to-dos under Work, Personal, and Urgent.

Each task includes:

Title

Description

Priority (High / Medium / Low)

Category

Group tasks by category in the UI.

Features

➕ Add new to-do items

🔽 Sort tasks within each category by priority (High → Low)

✅ Mark tasks as Completed → move to “Completed Tasks” section

❌ Delete tasks

Data Persistence

Save tasks (active & completed) locally via Ionic Storage or LocalStorage.

Logic Requirements

Dynamically group tasks by category

Sort tasks correctly by priority

Remove completed tasks from active lists and display them separately

Navigation

/login → Login page

/dashboard → Categorized to-do dashboard

Optional Enhancements

🔍 Add a search bar to filter tasks by title/description

✏️ Allow editing tasks after creation
