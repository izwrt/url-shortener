import { Router } from "express";
import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { unauthorizedError } from "../utils/api-respose.js";

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    if (!req.user || typeof req.user === 'string') {
        return res.status(401).json(unauthorizedError);
    }

    const { userId } = req.user;
})