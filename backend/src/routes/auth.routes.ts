import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { Router } from "express";
import db from "../db/index.js";
import { userTable } from "../db/schema.js";
import { secureThePassword } from "../utils/crypto.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { loginSchema, registerSchema } from "../validation/auth.validation.js";
import { validationError, invalidCredentialsError } from "../utils/api-respose.js";


const authRouter: Router = Router();

authRouter.post("/sign-up", async (req: Request, res: Response) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(validationError(result.error.flatten().fieldErrors));
    }

    const { firstName, lastName, email, password } = result.data;

    const [existingUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (existingUser)
      return res.status(409)
      .json({ error: {
          code: "EMAIL_ALREADY_EXISTS",
          message: "This email is already registered. Please sign in to continue." 
        }  
      });

    const { hash, salt } = await secureThePassword(password);

    const newUser = await db.insert(userTable).values({
      firstName,
      lastName,
      email,
      password: hash,
      salt,
    });

    return res.status(201).json({
      message: "User created",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(invalidCredentialsError);
    }

    const { email, password } = result.data

    const [existingUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (!existingUser) {
      return res.status(400).json(invalidCredentialsError)
    }
    const savedSalt = existingUser.salt;
    const savedPassword = existingUser.password;

    const { hash } = await secureThePassword(password, savedSalt);

    if (savedPassword !== hash) {
      return res.status(400).json(invalidCredentialsError)
    } 

    const token = jwt.sign(
      { userId: existingUser.id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default authRouter;
