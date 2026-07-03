const {connectDB} = require("./config/db")
const app = require ("./app")


connectDB();


const port  = process.env.PORT

app.listen(port, ()=>{
    console.log(`Server is Running on Port ${port}` )
})