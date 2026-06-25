import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

import { HttpError } from '../errors/http-error';
import { CreateTaskInput, Task, UpdateTaskInput } from '../interfaces/task.interface';

const defaultDatabasePath = process.env.DATABASE_PATH || join(process.cwd(), 'data', 'tasks.db');

type TaskRow = {
  id: string;
  title: string;
  status: Task['status'];
};

const toTask = (row: TaskRow): Task => ({
  id: row.id,
  title: row.title,
  status: row.status,
});

export class TaskService {
  private readonly database: DatabaseSync;

  constructor(databasePath = defaultDatabasePath) {
    if (databasePath !== ':memory:') {
      mkdirSync(dirname(databasePath), { recursive: true });
    }

    this.database = new DatabaseSync(databasePath);
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending', 'completed'))
      )
    `);
  }

  findAll(): Task[] {
    const rows = this.database
      .prepare('SELECT id, title, status FROM tasks ORDER BY rowid DESC')
      .all() as unknown as TaskRow[];

    return rows.map(toTask);
  }

  findById(id: string): Task {
    const row = this.database
      .prepare('SELECT id, title, status FROM tasks WHERE id = ?')
      .get(id) as unknown as TaskRow | undefined;

    if (!row) {
      throw new HttpError(404, 'Tarea no encontrada');
    }

    return toTask(row);
  }

  create(input: CreateTaskInput): Task {
    const task: Task = {
      id: randomUUID(),
      title: input.title,
      status: 'pending',
    };

    this.database
      .prepare('INSERT INTO tasks (id, title, status) VALUES (?, ?, ?)')
      .run(task.id, task.title, task.status);

    return task;
  }

  update(id: string, input: UpdateTaskInput): Task {
    const currentTask = this.findById(id);
    const updatedTask: Task = {
      ...currentTask,
      title: input.title ?? currentTask.title,
      status: input.status ?? currentTask.status,
    };

    this.database
      .prepare('UPDATE tasks SET title = ?, status = ? WHERE id = ?')
      .run(updatedTask.title, updatedTask.status, id);

    return updatedTask;
  }

  complete(id: string): Task {
    const task = this.findById(id);
    const completedTask: Task = {
      ...task,
      status: 'completed',
    };

    this.database.prepare('UPDATE tasks SET status = ? WHERE id = ?').run('completed', id);

    return completedTask;
  }

  remove(id: string): void {
    this.findById(id);
    this.database.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  }

  close(): void {
    this.database.close();
  }
}

export const taskService = new TaskService();
