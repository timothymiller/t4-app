import { InferSelectModel, InferInsertModel, relations, sql } from 'drizzle-orm'
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core'
import { createInsertSchema } from 'drizzle-valibot'
import { createId } from '../utils/id'

// User
export const UserTable = sqliteTable('User', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
})
export const userRelations = relations(UserTable, ({ many }) => ({
  sessions: many(SessionTable),
  userKeys: many(UserKeyTable),
}))
export type User = InferSelectModel<typeof UserTable>
export type InsertUser = InferInsertModel<typeof UserTable>
export const UserSchema = createInsertSchema(UserTable)

// User Key is an authentication method
// Users have a 1-to-many relationship to keys
// The id consists of a provider type combined with a provider id
// https://lucia-auth.com/basics/keys/
export const UserKeyTable = sqliteTable(
  'UserKey',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => UserTable.id),
    hashedPassword: text('hashed_password'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    userIdIdx: index('idx_userKey_userId').on(t.userId),
  })
)
export const userKeyRelations = relations(UserKeyTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [UserKeyTable.userId],
    references: [UserTable.id],
  }),
}))
export type UserKey = InferSelectModel<typeof UserKeyTable>
export type InsertUserKey = InferInsertModel<typeof UserKeyTable>
export const UserKeySchema = createInsertSchema(UserKeyTable)

export const SessionTable = sqliteTable(
  'Session',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => UserTable.id),
    activeExpires: integer('active_expires', { mode: "timestamp_ms" }).notNull(),
    idleExpires: integer('idle_expires', { mode: "timestamp_ms" }).notNull(),
  },
  (t) => ({
    userIdIdx: index('idx_session_userId').on(t.userId),
  })
)
export const sessionRelations = relations(SessionTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [SessionTable.userId],
    references: [UserTable.id],
  }),
}))
export type Session = InferSelectModel<typeof SessionTable>
export type InsertSession = InferInsertModel<typeof SessionTable>
export const SessionSchema = createInsertSchema(SessionTable)

export const VerificationCodeTable = sqliteTable(
  'VerificationCode',
  {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    userId: text('user_id')
      .notNull()
      .unique()
      .references(() => UserTable.id),
    code: text('code').notNull(),
    expires: integer('expires', { mode: "timestamp_ms" }).notNull(),
    timeoutUntil: integer('timeout_until', { mode: "timestamp_ms" }),
    timeoutSeconds: integer('timeout_seconds').notNull().default(0),
  },
  (t) => ({
    userIdIdx: index('idx_verificationCode_userId').on(t.userId),
  })
)
export type VerificationCode = InferSelectModel<typeof VerificationCodeTable>
export type InsertVerificationCode = InferInsertModel<typeof VerificationCodeTable>
export const VerificationCodeSchema = createInsertSchema(VerificationCodeTable)

// Car
export const CarTable = sqliteTable('Car', {
  id: text('id').primaryKey(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  color: text('color').notNull(),
  price: real('price').notNull(),
  mileage: integer('mileage').notNull(),
  fuelType: text('fuelType').notNull(),
  transmission: text('transmission').notNull(),
})
export type Car = InferSelectModel<typeof CarTable>
export type InsertCar = InferInsertModel<typeof CarTable>
export const CarSchema = createInsertSchema(CarTable)

export const TestTable = sqliteTable('Test', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
})
