import { Request, Response , NextFunction } from 'express';
import prisma from '../config/database';
import { CreateTaskDto, UpdateTaskDto } from '../models/taskTypes';
import { TaskStatus } from '@prisma/client';

export const createTask = async (req: Request, res: Response): Promise<Response> => {
  const { title, description, status, priority, dueDate }: CreateTaskDto = req.body;
  const userId = (req as any).user.userId;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status || 'TODO',
      priority: priority || 1,
      dueDate,
      userId
    }
  });

  return res.status(201).json({
    message: 'Task created successfully',
    task
  });
};

export const getTasks = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.userId;
  const { status, priority } = req.query;

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      ...(status && { status: status as TaskStatus }),
      ...(priority && { priority: Number(priority) })
    },
    orderBy: { createdAt: 'desc' }
  });

  return res.json({
    message: 'Tasks retrieved successfully',
    tasks
  });
};

export const getTaskById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const userId = (req as any).user.userId;

  const task = await prisma.task.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  return res.json({
    message: 'Task retrieved successfully',
    task
  });
};

export const updateTask = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate }: UpdateTaskDto = req.body;
  const userId = (req as any).user.userId;

  // First, verify the task belongs to the user
  const existingTask = await prisma.task.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!existingTask) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(dueDate && { dueDate })
    }
  });

  return res.json({
    message: 'Task updated successfully',
    task: updatedTask
  });
};

export const deleteTask = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const userId = (req as any).user.userId;

  // First, verify the task belongs to the user
  const existingTask = await prisma.task.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!existingTask) {
    return res.status(404).json({ message: 'Task not found' });
  }

  await prisma.task.delete({
    where: { id }
  });

  return res.json({
    message: 'Task deleted successfully'
  });
};

// Add global error handling middleware in index.ts
