const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    
    console.log("Connection Successful")
  }catch(err){

    console.log(`DB connection Failed ${err}`)
  }
}

module.exports  = {connectDB}