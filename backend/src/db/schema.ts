import { pgTable, uuid, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length:225 }).notNull(),
    email: varchar({ length:225 }).notNull(),
    password: text().notNull(),
    salt: text().notNull(),
    createdAt: timestamp().defaultNow().notNull()
});

export const urlsTable = pgTable("urls", {
    id: uuid().primaryKey().defaultRandom(),
    shortCode: varchar({ length:7 }).notNull(),
    longUrl: text().notNull(),
    userId: uuid().references(() => userTable.id),
    clicks: integer().notNull(),
    createdAt: timestamp().defaultNow().notNull()
});