/// <reference types="lucia" />

type DBAttributes = {
  // Note, these need to match the database column names,
  // so they might need to be snake_case instead of camelCase, for example
  // Adjust userToAuthUserAttributes in @t4/api/src/auth to match
  email: string | null
}

declare namespace Lucia {
  type Auth = import('./src/auth/shared').Auth
  type DatabaseUserAttributes = DBAttributes
  type DatabaseSessionAttributes = {}
}
