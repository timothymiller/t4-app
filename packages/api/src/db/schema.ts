import { InferModel } from 'drizzle-orm'
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { createInsertSchema } from 'drizzle-valibot'

// User
export const User = sqliteTable('User', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
})

export type User = InferModel<typeof User>
export const UserSchema = createInsertSchema(User)

// Car
export const Car = sqliteTable('Car', {
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

export type Car = InferModel<typeof Car>
export const CarSchema = createInsertSchema(Car)
