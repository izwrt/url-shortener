import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express';
import { createUrlSchema } from '../validation/urls.validation.js';
import { z } from 'zod/mini';
import { unauthorizedError } from '../utils/api-respose.js';

const urlRouter = Router();

urlRouter.post('/urls', async (req: Request, res: Response) => {

    if (!req.user) {
        res.status(401).json(unauthorizedError);
    }

    const result = createUrlSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(z.flattenError(result.error).fieldErrors)
    }

    if (result.data.customAlias) {
        
    }
 
})