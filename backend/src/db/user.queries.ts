import { eq } from 'drizzle-orm';
import db from './index.js'
import { userTable } from "./schema.js"

interface UserData {
      firstName: string,
      lastName?: string | undefined,
      email: string,
      password: string,
      salt: string,
    }

export const getUserByEmail = async(email: string) => {
    const [user] = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1)

    return user;
};

export const createUser = async(user: UserData) => {
    await db.insert(userTable).values(user);
}
