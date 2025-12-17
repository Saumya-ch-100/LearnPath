import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', routes);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from frontend/dist
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  
  // Handle React routing - return index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
} else {
  // Development - show API info
  app.get('/', (req, res) => {
    res.json({ message: 'LearnPath API is running. Frontend runs separately in development.' });
  });
}

// Error handling
app.use(errorHandler);

export default app;
