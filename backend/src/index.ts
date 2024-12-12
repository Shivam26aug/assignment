import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});