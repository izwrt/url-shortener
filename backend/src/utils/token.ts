import jwt from "jsonwebtoken";
import { jwtPayloadSchema } from "../validation/token.validation.js";

export const createToken = (userId: string) => {
  const validationResult = jwtPayloadSchema.safeParse({ userId });
  
  if (!validationResult.success) {
    throw new Error("INVALID_TOKEN_PAYLOAD");
  }

  const payloadData = validationResult.data 

  const token = jwt.sign( payloadData, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return token;
};
