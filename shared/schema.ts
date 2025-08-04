import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pin: varchar("pin", { length: 6 }).notNull(),
  securityQuestion: text("security_question").notNull(),
  securityAnswer: text("security_answer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  pin: z.string().min(4, "PIN must be at least 4 digits").max(6, "PIN must be at most 6 digits").regex(/^\d+$/, "PIN must contain only numbers"),
  securityQuestion: z.string().min(1, "Security question is required"),
  securityAnswer: z.string().min(1, "Security answer is required"),
});

export const loginUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  pin: z.string().min(4, "PIN must be at least 4 digits").max(6, "PIN must be at most 6 digits").regex(/^\d+$/, "PIN must contain only numbers"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;
