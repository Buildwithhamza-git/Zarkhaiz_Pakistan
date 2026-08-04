const path = require("path");
const http = require("http");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const {connectDB} = require("./config/db")
const app = require ("./app")
const { initSocket } = require("./socket");


connectDB();


const port  = process.env.PORT

const server = http.createServer(app);

initSocket(server);

server.listen(port, ()=>{
    console.log(`Server is Running on Port ${port}` )
})
