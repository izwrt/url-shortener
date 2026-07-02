import { pgTable, uuid, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    firstName: varchar({ length:55 }).notNull(),
    lastName: varchar({ length:55 }),
    email: varchar({ length:225 }).notNull().unique(),
    password: text().notNull(),
    salt: text().notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).notNull(),
});

export const urlsTable = pgTable("urls", {
    id: uuid().primaryKey().defaultRandom(),
    shortCode: varchar({ length:7 }).unique().notNull(),
    longUrl: text().notNull(),
    userId: uuid().references(() => userTable.id),
    clicks: integer().notNull().default(0),
    createdAt: timestamp().defaultNow().notNull()
});