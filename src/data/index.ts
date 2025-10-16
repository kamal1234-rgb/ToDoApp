import { TaskItem } from '../types';

export const todoList: TaskItem[] = [
  // --- URGENT Category (5 Tasks) ---
  {
    id: 'uaasdadasdasd',
    title: 'Fix Production Bug',
    description:
      'Investigate and deploy patch for critical login failure affecting all users.',
    priority: 'High',
    isCompleted: false,
    category: 'Urgent',
  },
  {
    id: 'ub',
    title: 'Pay Electricity Bill',
    description:
      'Due date is today. Must pay online immediately to avoid service interruption.',
    priority: 'High',
    isCompleted: false,
    category: 'Urgent',
  },
  {
    id: 'uc',
    title: 'Review Final Client Contract',
    description:
      'Client needs signature by EOD. Ensure all legal terms are correct.',
    priority: 'High',
    isCompleted: false,
    category: 'Urgent',
  },
  {
    id: 'ud',
    title: 'Emergency Vet Appointment',
    description: 'Take the dog to the vet for the sudden rash at 2 PM.',
    priority: 'High',
    isCompleted: false,
    category: 'Urgent',
  },
  {
    id: 'ue',
    title: 'Submit Expense Report',
    description:
      'Deadline for Q3 reimbursement is tomorrow morning. Must finish today.',
    priority: 'Medium',
    isCompleted: false,
    category: 'Urgent',
  },

  // --- WORK Category (8 Tasks) ---
  {
    id: 'wa',
    title: 'Develop User Profile Page',
    description: 'Implement the front-end for the new user profile dashboard.',
    priority: 'Medium',
    isCompleted: false,
    category: 'Work',
  },
  {
    id: 'wb',
    title: 'Refactor Auth Service',
    description:
      'Replace old monolithic authentication service with microservices approach.',
    priority: 'Low',
    isCompleted: false,
    category: 'Work',
  },
  {
    id: 'wc',
    title: 'Weekly Team Standup Prep',
    description:
      "Prepare notes on last week's accomplishments and blockers for the morning meeting.",
    priority: 'Medium',
    isCompleted: false,
    category: 'Work',
  },
  {
    id: 'wd',
    title: 'Code Review: Feature X',
    description:
      'Review Pull Request #157 from David for the new reporting feature.',
    priority: 'High',
    isCompleted: false,
    category: 'Work',
  },
  {
    id: 'w',
    title: 'Update API Documentation',
    description: 'Document the new `/users/{id}/data` endpoint in Swagger.',
    priority: 'Low',
    isCompleted: false,
    category: 'Work',
  },
  {
    id: 'w6',
    title: 'Schedule Q4 Planning Meeting',
    description:
      'Find a time slot that works for all department heads next week.',
    priority: 'Medium',
    isCompleted: false,
    category: 'Work',
  },
  {
    id: 'w7',
    title: 'Interview Candidate A',
    description:
      'Conduct the technical screening interview for the senior developer role.',
    priority: 'High',
    isCompleted: false,
    category: 'Work',
  },
  {
    id: 'w8',
    title: 'Backup Database',
    description:
      'Perform a full manual database backup before the migration starts.',
    priority: 'Medium',
    isCompleted: false,
    category: 'Work',
  },

  // --- PERSONAL Category (7 Tasks) ---
  {
    id: 'p1',
    title: 'Grocery Shopping',
    description:
      'Need milk, eggs, bread, and spinach. Check pantry list first.',
    priority: 'Medium',
    isCompleted: false,
    category: 'Personal',
  },
  {
    id: 'p2',
    title: 'Read Chapter 3 of Book',
    description: 'Finish the current chapter of "The Mythical Man-Month."',
    priority: 'Low',
    isCompleted: false,
    category: 'Personal',
  },
  {
    id: 'p3',
    title: 'Clean Apartment',
    description: 'Vacuum living room and dust all surfaces.',
    priority: 'Medium',
    isCompleted: false,
    category: 'Personal',
  },
  {
    id: 'p4',
    title: 'Call Insurance Agent',
    description: 'Discuss renewal options for the car insurance policy.',
    priority: 'High',
    isCompleted: false,
    category: 'Personal',
  },
  {
    id: 'p5',
    title: 'Yoga Class',
    description: 'Attend the 6:00 PM Vinyasa flow class at the studio.',
    priority: 'Low',
    isCompleted: false,
    category: 'Personal',
  },
  {
    id: 'p6',
    title: 'Mow Lawn',
    description: 'The lawn is overgrown; check the weather forecast first.',
    priority: 'Medium',
    isCompleted: false,
    category: 'Personal',
  },
  {
    id: 'p7',
    title: 'Research Hiking Trails',
    description: 'Plan a route for the weekend trip.',
    priority: 'Low',
    isCompleted: false,
    category: 'Personal',
  },
];
