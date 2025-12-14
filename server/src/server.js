const express = require("express");
const dotenv =require("dotenv")
const connectDB = require("./config/db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

app.get("/",(req,res)=>{
    res.send({msg:"Helpy API is running"})
})

// connect Db
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`server running at port ${process.env.PORT}`);
});
