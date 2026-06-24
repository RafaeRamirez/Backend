export const TASK_STATUSES = ['pending', 'completed'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface CreateTaskInput {
  title: string;
}

export interface UpdateTaskInput {
  title: string;
  status?: TaskStatus;
}

export const isTaskStatus = (status: unknown): status is TaskStatus =>
  typeof status === 'string' && TASK_STATUSES.includes(status as TaskStatus);
