import express, { Request, Response, NextFunction } from 'express';
import { 
  createTask, 
  getTasks, 
  getTaskById, 
  updateTask, 
  deleteTask 
} from '../controllers/taskController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = express.Router();

// Wrapper function to handle async route handlers
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<Response>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

// All task routes require authentication
router.post('/', requireAuth, asyncHandler(createTask));
router.get('/', requireAuth, asyncHandler(getTasks));
router.get('/:id', requireAuth, asyncHandler(getTaskById));
router.put('/:id', requireAuth, asyncHandler(updateTask));
router.delete('/:id', requireAuth, asyncHandler(deleteTask));

export default router;
