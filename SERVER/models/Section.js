const mongoose=require('mongoose')
const SubSection = require('./SubSection')

const sectionSchema=new mongoose.Schema({
 sectionSchema:{
    type:String,
 },
 SubSection:[{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'SubSection',
 }],
 

})

module.exports=mongoose.model("Section",sectionSchema)