import { Request, Response } from 'express';
import prisma from '../config/database';
import { CreateTaskDto, UpdateTaskDto } from '../models/taskTypes';

export const createTask = async (req: Request, res: Response): Promise<Response> => {
  try {
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
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ 
      message: 'Error creating task', 
      error: (error as Error).message 
    });
  }
};

export const getTasks = async (req: Request, res: Response): Promise<Response> => {
  try {
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
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    return res.status(500).json({ 
      message: 'Error retrieving tasks', 
      error: (error as Error).message 
    });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<Response> => {
  try {
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
  } catch (error) {
    console.error('Error retrieving task:', error);
    return res.status(500).json({ 
      message: 'Error retrieving task', 
      error: (error as Error).message 
    });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<Response> => {
  try {
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
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ 
      message: 'Error updating task', 
      error: (error as Error).message 
    });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<Response> => {
  try {
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
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ 
      message: 'Error deleting task', 
      error: (error as Error).message 
    });
  }
};