import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors"
import { Request , Response , NextFunction } from 'express';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

const app = express();

const PORT = process.env.PORT || 3000;

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: err.message
  });
});

// Middleware
app.use(bodyParser.json());
app.use(cors())
// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
