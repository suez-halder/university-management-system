// src/server.ts

import config from './app/config';
import mongoose from 'mongoose';
import app from './app';
import { Server } from 'http';
import seedSuperAdmin from './app/DB';

let server: Server;

async function main() {
  try {
    // await mongoose.connect(process.env.DATABASE_URL);
    // TODO: write await before production
    await mongoose.connect(config.database_url as string); // typescript er assertion type use kora hoise

    seedSuperAdmin();

    server = app.listen(config.port, () => {
      console.log(`App is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

/* vodrovabe computer off kora
! unhandledRejection → asynchronous 
server.close(() => {
  process.exit(1)
})

*/
process.on('unhandledRejection', () => {
  console.log('👹 unhandledRejection is detected!');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

/* direct power button chepe computer off kora
! uncaughtException → synchronous
process.exit(1) 
*/

process.on('uncaughtException', () => {
  console.log('👹 uncaughtException is detected!');
  process.exit(1);
});
