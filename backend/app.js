require('dotenv').config(); 
const express =require('express');
const {createServer}=require('node:http');
const {Server}=require('socket.io');
const {connectToSocket} = require('./controllers/socketManager');
const mongoose=require('mongoose');
const users= require("./routes/users");
const cors=require('cors');
const dbUrl=process.env.MONGO_URL;
const port = process.env.PORT || 3000;


const app= express();
const server=createServer(app);
const io=connectToSocket(server);


main().then(()=>{
  console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

}

app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb" ,extended:true}));

app.use("/api/v1/users",users);

server.listen(port,()=>{
    console.log(`listining on port ${port}`);
})