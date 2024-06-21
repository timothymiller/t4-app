// src/routers/cars.ts
import { InsertCar, insertCarSchema, CarTable, selectCarSchema } from './../db/schema'
import { publicProcedure, router } from '../trpc'
import { safeParse, string, partial, pick } from 'valibot'
import { eq } from 'drizzle-orm'

export const carsRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx
    const allCars = await db.select().from(CarTable).all()
    return allCars
  }),
  list: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx
    const listCars = await db.select().from(CarTable).all()
    return listCars
  }),

  create: publicProcedure
    .input((raw) => raw)
    .mutation(async ({ ctx, input }) => {
      console.log('starting create in cars.ts', input)
      const { db } = ctx

      // Validate car
      const validationResult = safeParse(insertCarSchema, input)
      console.log(validationResult)

      if (!validationResult.success) {
        throw new Error('Invalid car')
      }

      const now = new Date()

      const newCar = validationResult.output
      newCar.createdAt = now
      console.log('new car with updated createdAt', newCar)

      const newCarResult = await db.insert(CarTable).values(newCar).returning()
      console.log('newCarResult', newCarResult)
      return newCar
    }),
  update: publicProcedure
    .input((raw) => raw)
    .mutation(async ({ ctx, input }) => {
      console.log('starting update in cars.ts', input)
      const { db } = ctx

      // Validate car
      const validationResult = safeParse(partial(insertCarSchema), input)
      console.log(validationResult)

      if (!validationResult.success) {
        throw new Error('Invalid car')
      }

      const { id } = validationResult.output

      const now = new Date()

      const updatedCar = validationResult.output
      updatedCar.updatedAt = now

      console.log('updatedCar', updatedCar)

      const updatedCarResult = await db
        .update(CarTable)
        .set(updatedCar)
        .where(eq(CarTable.id, id))
        .returning()
      console.log('updatedCarResult', updatedCarResult)
      console.log('validationResult output', validationResult.output)
      return updatedCar
    }),
  delete: publicProcedure
    .input((raw) => raw)
    .mutation(async ({ ctx, input }) => {
      console.log('starting delete in cars.ts', input)
      const { db } = ctx

      // Validate car id
      const validationResult = safeParse(pick(selectCarSchema, ['id']), input)
      console.log(validationResult)

      if (!validationResult.success) {
        throw new Error('Invalid car ID')
      }

      const { id } = validationResult.output

      const deletedCar = await db.delete(CarTable).where(eq(CarTable.id, id)).returning()
      console.log('deletedCar', deletedCar[0])
      return id
    }),
})
