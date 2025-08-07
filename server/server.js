// server/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { analyzeVideo } from './controllers/analyzeController.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/analyze', analyzeVideo);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
