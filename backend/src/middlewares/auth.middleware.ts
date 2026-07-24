import type { NextFunction, Request, Response } from "express";
import { tokenExpiredError, unauthorizedError } from "../utils/api-respose.js";
import { verifyToken } from "../utils/token.js";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const hasAuthHeader = req.headers.authorization;

  if (!hasAuthHeader && !hasAuthHeader?.startsWith("Bearer ")) {
    return res.status(401).json(unauthorizedError);
  }

  const token = hasAuthHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json(unauthorizedError);
  }

  try {
    const decodedToken = verifyToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return res.status(401).json(tokenExpiredError);
    }
    return res.status(401).json(unauthorizedError);
  }
};
