//fg4sCv9HPcOBTbS7

const express =require("express")
const mongoose=require("mongoose")
const {MONGOURI}=require("./keys")
const app=express();
const PORT=5006;


mongoose.connect(MONGOURI,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true
});
mongoose.connection.on("connected",()=>{
    console.log("Connected to mongo");
})

mongoose.connection.on("error",(err)=>{
    console.log("error connecting",err);
})

require("./models/user")
require("./models/post")
app.use(express.json());
app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))

// app.get("/",(req,res)=>{
//     res.send("Hello World");
//     console.log("Home")
// })


app.listen(PORT,()=>{
    console.log("Server is running at ",PORT)
})