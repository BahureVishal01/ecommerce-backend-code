
const app = require("./app");

const mongoose = require("mongoose");
const configServer = require("./config/config.server");
const dbConfig = require("./config/db.config");
  //require("./config/database");
  const PORT = 3000

//dotenv.config({path:"./config.env"})

//Handling uncaught exception

process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught Exception');
    process.exit(1);
})

     mongoose.connect(dbConfig.DB_URI/* {useNewUrlParse:true, useUnifiedTopology:true, useCreatIndex:true}*/).then(
        (data)=>{
            console.log(`Mongodb connected with server: ${data.connection.host}`);

       })
        // .catch((err)=>{
        //     console.log(err)
        // })




const server = app.listen(PORT, ()=>{
    console.log(`Server is working on http://localhost:${PORT}`);
})

//Unhandled Promise rejection: ex. error: DB_URI:"mongo://localhost:27017/serverapp". in this db is missing in mongo.
process.on("unhandledRejection", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log('shutting down the server due to unhandled Promise rejection');
    server.close(()=>{
        process.exit(1);
    })
})

