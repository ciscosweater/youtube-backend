import express from 'express';
import { userRoutes } from './routes/user.routes';
import { videoRoutes } from './routes/video.routes';
import { config } from 'dotenv';

config();
const app = express();

app.use(express.json());
app.use('/user', userRoutes);
app.use('/video', videoRoutes);

app.listen(4000);