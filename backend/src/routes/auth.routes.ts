import { Router } from 'express';
import type { Request, Response } from 'express';
import db from '../db/index.js';
import { userTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { secureThePassword } from '../utils/crypto.js';

const authRouter: Router = Router();

authRouter.post('/sign-up', async (req: Request, res: Response) => {
    try {
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

        const [existingUser] = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);

        if (existingUser) return res.status(409).json({ error: "Email already in use" });

        const { hash, salt } = await secureThePassword(password);

        const newUser = await db.insert(userTable).values({
            firstName,
            lastName,
            email,
            password: hash,
            salt
        });

        return res.status(201).json({
            message: "User created"
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error"});
    } 
});
export default authRouter;