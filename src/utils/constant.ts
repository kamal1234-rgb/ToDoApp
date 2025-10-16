export const BASE_URL: string = 'https://dummyjson.com';
export const LoginAPI: string = '/auth/login';

export function generateRandomFourCharString(length: number = 10) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export function getPriorityTextColor(priority: string) {
  return priority == 'Low'
    ? 'green'
    : priority == 'Medium'
    ? '#007bff'
    : priority == 'High'
    ? 'red'
    : '#2a2727';
}

export function getCategoryColor(category: string) {
  return category == 'Personal'
    ? 'green'
    : category == 'Work'
    ? '#007bff'
    : category == 'Urgent'
    ? 'red'
    : '#2a2727';
}
