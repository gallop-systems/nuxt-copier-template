export default defineEventHandler(async () => {
  const db = useDatabase();
  return db.selectFrom("users").selectAll().execute();
});
