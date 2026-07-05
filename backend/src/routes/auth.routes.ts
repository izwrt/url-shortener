import type { Request, Response } from "express";
import { Router } from "express";
import { z } from "zod";
import "dotenv/config";
import { loginSchema, registerSchema } from "../validation/auth.validation.js";
import {
  validationError,
  invalidCredentialsError,
} from "../utils/api-respose.js";
import { loginUser, registerUser } from "../services/auth.service.js";

const authRouter: Router = Router();

authRouter.post("/sign-up", async (req: Request, res: Response) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res
        .status(400)
        .json(validationError(z.flattenError(result.error).fieldErrors));
    }

    await registerUser(result.data);

    return res.status(201).json({
      message: "User created",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        error: {
          code: "EMAIL_ALREADY_EXISTS",
          message: "This email is already registered.",
        },
      });
    }

    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(401).json(invalidCredentialsError);
    }
    
    const token = await loginUser(result.data);
    return res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json(invalidCredentialsError);
    }

    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default authRouter;
