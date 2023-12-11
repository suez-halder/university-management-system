// src/server.ts
import config from './app/config';
import mongoose from 'mongoose';
import app from './app';

async function main() {
  try {
    // await mongoose.connect(process.env.DATABASE_URL);
    // TODO: write await before production
    mongoose.connect(config.database_url as string); // typescript er assertion type use kora hoise
    app.listen(config.port, () => {
      console.log(`App is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
