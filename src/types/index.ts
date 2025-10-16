enum priority {
  'High',
  'Medium',
  'Low',
}

enum category {
  'Work',
  'Personal',
  'Urgent',
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  priority: priority.High | priority.Medium | priority.Low | number | string;
  category: category.Work | category.Personal | category.Urgent | string;
  isComplited?:boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number; // Optional field
}

export interface ApiError extends Error {
  statusCode?: number;
  data?: any;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | string; 
  image: string;
  accessToken: string;
  refreshToken: string;
}
