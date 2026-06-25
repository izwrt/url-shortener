import 'dotenv/config';
import express from 'express';
import authRouter from './routes/auth.routes.js';

const app = express();

app.use(express.json());

const port = process.env.PORT ?? 8000;

app.use('/api/auth', authRouter);

const server = app.listen(port, () => {
    console.log(`Server running on the port: ${port}`);
})
