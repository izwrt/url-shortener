import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';
import { Router } from 'express';
import db from '../db/index.js';
import { userTable } from '../db/schema.js';
import { secureThePassword } from '../utils/crypto.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authRouter: Router = Router();

authRouter.post('/sign-up', async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password)
            return res.status(400).
            json({error:"Fields are required"});

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

authRouter.post('/login', async(req: Request, res: Response) => {
    try{
        const { email, password } = req.body;

        if (!email || !password) return
            res.status(400).json({ error: "Fields are missing"});

        const [existingUser] = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);

        if (!existingUser) return
            res.status(401).json({ error: "Invalid email or password" });

        const savedSalt = existingUser.salt;
        const savedPassword = existingUser.password

        const { hash } = await secureThePassword(password, savedSalt);

        if (savedPassword !== hash) return 
            res.status(401).json({ error: "Invalid email or password" });

        const token = jwt.sign(
            { userId: existingUser.id },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: "Login successful",
            token: token
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error"})
    }  
})

export default authRouter;