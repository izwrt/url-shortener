import { Router } from 'express';
import type { Request, Response } from 'express';
import crypto from 'crypto';

const router = Router();

router.post('/sign-up', (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password)
        return res.status(400).
        json({error:"All fields are required"});

    if (typeof firstName!== 'string' || typeof email !== 'string')
        return res.status(400)
        .json({ error: "Invalid data type" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
        return res.status(400)
        .json({ error: "Invalid email format" });

    if (password.length < 8) {
        return res.status(400)
        .json({ error: "Password must be atleast 8 character" });
    }
    
    const salt = crypto.randomBytes(32).toString('hex') as string;

})