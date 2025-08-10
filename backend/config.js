require('dotenv').config({ path: __dirname + '/.env' });
console.log(process.env.DATABASE_URL);
 console.log(process.env.DATABASE_URL);
module.exports = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  geminiapiKey: process.env.GEMINI_API_KEY,
  jwtSecret: process.env.JWT_SECRET
};