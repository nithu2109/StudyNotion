const mongoose=require('mongoose');
require('dotenv').config();

exports.connect=()=>{
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log("DB Connected Successfull"))
.catch((error)=>{
console.log("DB Connection failed");
console.log(error)
process.exit(1)
})
}