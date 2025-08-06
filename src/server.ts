/* eslint-disable no-console */
import { Server } from 'http';
import app from "./app";
import { envVars } from "./app/config/env";
import connectToDb from "./app/database/db";
import { seedSuperAdmin } from './app/util/seedSuperAdmin';

let server: Server;

const startServer = async() => {
    try{
        await connectToDb();
        server = app.listen(envVars.PORT, () => console.log(`Server is running at port: ${envVars.PORT}`));
    }catch(err){
        console.log(err);
    }
}


(async () => {
    await startServer();
    await seedSuperAdmin();
})();


process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection detected.... Server shuting down!", err);
    if(server){
        server.close(() =>{
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

process.on("uncaughtException", (err) => {
    console.log("Uncaught exception detected.... Server shuting down!", err);
    if(server){
        server.close(() =>{
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

process.on("SIGTERM", () => {
    console.log("SIGTERM detected.... Server is shuting down!");
    if(server){
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

