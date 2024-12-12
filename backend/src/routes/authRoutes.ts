import express, { Request, Response, NextFunction } from 'express';
import { register, login } from '../controllers/authController';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await register(req, res);
  } catch (error) {
    next(error);
  }
});
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await login(req, res);
  } catch (error) {
    next(error);
  }
});

// Example of a protected route
router.get('/admin-only', requireAuth, requireAdmin, (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

// Example of an authenticated user route
router.get('/profile', requireAuth, (req, res) => {
  const user = (req as any).user;
  res.json({ message: 'Protected route', userId: user.userId });
});

export default router;