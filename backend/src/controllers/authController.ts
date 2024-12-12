import { Request, Response } from 'express';
import prisma from '../config/database';
import { generateToken } from '../utils/tokenUtils';
import bcrypt from 'bcryptjs';

export const register = async (req: Request, res: Response):Promise<Response> => {
  try {
    const { email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'USER'
      }
    });

    // Generate JWT token
    const token = generateToken(user.id, user.role);

    return res.status(201).json({ 
      message: 'User registered successfully',
      token,
      userId: user.id,
      role: user.role
    });
  } catch (error) {
    console.error(error);
     return res.status(500).json({ message: 'Error registering user', error });
  }
};

export const login = async (req: Request, res: Response) :Promise<Response>=> {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.role);

   return  res.json({ 
      message: 'Login successful',
      token,
      userId: user.id,
      role: user.role
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
