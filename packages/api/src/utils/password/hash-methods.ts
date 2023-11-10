// Upgrade stored hashes to better algorithms as users sign in
export type HashMethod = 'argon2' | 'scrypt'
export const DEFAULT_HASH_METHOD: HashMethod = 'argon2'
export const HASH_METHODS: [HashMethod, ...HashMethod[]] = ['argon2', 'scrypt']
