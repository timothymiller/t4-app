import {
  boolean,
  integer,
  maxValue,
  minLength,
  minValue,
  number,
  object,
  optional,
  string,
} from 'valibot'

export const ActivationSchema = object({
  id: string(),
  deactivated: boolean(),
})

export const GetByIdSchema = object({
  id: string(),
})

export const GetSessionsSchema = object({
  userId: string(),
})

export const InfiniteScrollSchema = object({
  cursor: optional(string([minLength(1)])),
  limit: optional(number([integer(), minValue(1), maxValue(500)])),
})
