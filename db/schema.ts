import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, serial, integer,date,varchar } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));


export const habits = pgTable('habits', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  frequency: text('frequency'),
  created_at: timestamp('created_at').defaultNow(),
});

export const habit_logs = pgTable('habit_logs', {
  id: serial('id').primaryKey(),
  habit_id: integer('habit_id').notNull(),
  log_date: date('log_date').notNull(),
  completed: boolean('completed').default(false),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  due_date: timestamp('due_date'),
  completed: boolean('completed').default(false),
  priority: varchar('priority', { length: 10 }).default('medium'), 
  priority_status: varchar('priority_status', { length: 20 }).default('normal'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const taskOrders = pgTable("task_orders", {
  id: serial("id").primaryKey(),
  user_id: text("user_id") // ← change from integer to text
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  task_id: integer("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  view_key: text("view_key").notNull(), // e.g., "all", "today", "high-priority" etc.
  position: integer("position").notNull(),
},
(table) => [
  index("task_orders_user_view_idx").on(table.user_id, table.view_key),
  index("task_orders_position_idx").on(table.user_id, table.view_key, table.position),
]);


export const schema = {
  user,
  session,
  account,
  verification,
  userRelations,
  sessionRelations,
  accountRelations,
  habits,
  habit_logs,
  tasks
};

