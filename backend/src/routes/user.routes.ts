import { Router } from 'express';
import type { Request, Response } from 'express';
import crypto from 'crypto';
import db from '../db/index.js';
import { userTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { secureThePassword } from '../utils/crypto.js';

const router = Router();

router.post('/sign-up', async (req: Request, res: Response) => {
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

    const [result] = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);

    if (result) return res.status(409).json({ error: "Email already in use" });
    
    

})