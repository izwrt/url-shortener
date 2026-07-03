import { getUserByEmail, createUser } from "../db/user.queries.js";
import { secureThePassword } from "../utils/crypto.js";
import jwt from "jsonwebtoken";

interface UserData {
      firstName: string,
      lastName?: string | undefined,
      email: string,
      password: string,
    }

export const registerUser = async (userData: UserData) => {
  const existingUser = await getUserByEmail(userData.email);

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const { hash, salt } = await secureThePassword(userData.password);

  await createUser({
    firstName: userData.firstName,
    lastName: userData.lastName ?? "",
    email: userData.email,
    password: hash,
    salt: salt,
  });
};
