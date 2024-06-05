import dotenv from 'dotenv';
dotenv.config();
import { connectToDatabase } from './db.config.js';
import { server } from './server.js';
server.listen(3000, () => {
    console.log("Listening on port 3000");
    connectToDatabase();
});
