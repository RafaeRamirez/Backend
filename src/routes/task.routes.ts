import { Router } from 'express';

import {
  completeTask,
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from '../controllers/task.controller';

const taskRouter = Router();

taskRouter.get('/', getTasks);
taskRouter.get('/:id', getTaskById);
taskRouter.post('/', createTask);
taskRouter.put('/:id', updateTask);
taskRouter.patch('/:id/complete', completeTask);
taskRouter.delete('/:id', deleteTask);

export default taskRouter;
