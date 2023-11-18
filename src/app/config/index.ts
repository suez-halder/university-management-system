// src/app/config/index.ts

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });
// eikhane path hocche: /Volumes/Dev/Level-2/Mission 2 - Be a Mongoose Master/Module 8 - Core concepts of Mongoose/first-project/.env

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
};
