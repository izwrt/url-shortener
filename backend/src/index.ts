import express from 'express';
import type { Request, Response } from 'express';
import 'dotenv/config';

const app = express();

app.use(express.json());

const port = process.env.PORT ?? 8000;

app.get('/', (req: Request, res: Response) => {
    res.json({ message: "Here are the users" });
});

const server = app.listen(port, () => {
    console.log(`Server running on the port: ${port}`);
})
