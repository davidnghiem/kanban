import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const columns = pgTable('columns', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  position: integer('position').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  columnId: integer('column_id').references(() => columns.id),
  position: integer('position').notNull().default(0),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Column = typeof columns.$inferSelect;
export type NewColumn = typeof columns.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
