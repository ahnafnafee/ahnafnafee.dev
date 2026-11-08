// Loaded only in the migration CLI regression test's child process.
globalThis.fetch = async () => {
  throw new Error(process.env.DATABASE_URL)
}
