import { pgTable, text, serial, integer, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  document: text("document").notNull(),
  phone: text("phone").notNull(),
  lastLogin: timestamp("last_login"),
  isAdmin: integer("is_admin").default(0).notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  lastLogin: true,
});

// Account Schema
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  accountNumber: text("account_number").notNull().unique(),
  accountType: text("account_type").notNull(),
  balance: doublePrecision("balance").notNull().default(0),
  status: text("status"),
  statusMessage: text("status_message"),
});

export const insertAccountSchema = createInsertSchema(accounts).omit({
  id: true,
});

// Transaction Schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull().references(() => accounts.id),
  amount: doublePrecision("amount").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  type: text("type").notNull(), // deposit, withdrawal, transfer, payment
  reference: text("reference"),
  recipientId: integer("recipient_id").references(() => accounts.id),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

// Beneficiary Schema
export const beneficiaries = pgTable("beneficiaries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  bank: text("bank").notNull(),
  accountNumber: text("account_number").notNull(),
  accountType: text("account_type").notNull(),
});

export const insertBeneficiarySchema = createInsertSchema(beneficiaries).omit({
  id: true,
});

// Service Schema for Bill Payments
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // electricity, water, phone, etc.
  description: text("description"),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

// User Session Schema for Admin Panel
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  loginTime: timestamp("login_time").notNull().defaultNow(),
  logoutTime: timestamp("logout_time"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  sessionDuration: integer("session_duration"),
});

export const insertSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  sessionDuration: true,
  logoutTime: true,
}).extend({
  ipAddress: z.string().nullable().optional().default(null),
  userAgent: z.string().nullable().optional().default(null)
});

// Type declarations
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accounts.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertBeneficiary = z.infer<typeof insertBeneficiarySchema>;
export type Beneficiary = typeof beneficiaries.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertUserSession = z.infer<typeof insertSessionSchema>;
export type UserSession = typeof userSessions.$inferSelect;
