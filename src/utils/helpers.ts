import { TaskItem } from "../types";

export const groupByCategory = (data: TaskItem[]): Record<string, TaskItem[]> => {
  return data.reduce((groups, item) => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, TaskItem[]>);
};