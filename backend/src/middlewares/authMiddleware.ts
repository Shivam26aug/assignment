import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { verifyToken } from '../utils/tokenUtils';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) :Promise<void>=> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
     res.status(401).json({ message: 'Authorization token required' });
     return
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    
    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
       res.status(401).json({ message: 'User not found' });
       return
    }

    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction):void => {
  const user = (req as any).user;
  
  if (!user || user.role !== 'ADMIN') {
    res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};