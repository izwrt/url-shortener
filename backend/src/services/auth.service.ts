import { getUserByEmail, createUser } from "../db/user.queries.js";
import { secureThePassword } from "../utils/crypto.js";
import "dotenv/config";
import { createToken } from "../utils/token.js";

interface UserData {
  firstName: string;
  lastName?: string | undefined;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (userData: UserData) => {
  const existingUser = await getUserByEmail(userData.email);

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const { hash, salt } = await secureThePassword(userData.password);

  await createUser({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: hash,
    salt: salt,
  });
};

export const loginUser = async (loginData: LoginData) => {
  const existingUser = await getUserByEmail(loginData.email);

  if (!existingUser) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const savedSalt = existingUser.salt;
  const savedPassword = existingUser.password;
  const { hash } = await secureThePassword(loginData.password, savedSalt);

  if (savedPassword !== hash) {
    throw new Error("INVALID_CREDENTIALS");
  }
  
  const token = createToken(existingUser.id);

  return token
};
