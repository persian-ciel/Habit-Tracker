export default {
  schema: "./db/schema.ts",           // مسیر فایل schema شما
  out: "./drizzle/migrations",       // مسیر ذخیره migration‌ها
  dialect: "postgresql",             // برای Neon
  dbCredentials: process.env.DATABASE_URL!, // connection string به Neon
};
