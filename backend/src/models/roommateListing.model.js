const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  ownerId:{type:String,required:true,index:true}, propertyId:{type:String,required:true,index:true},
  propertyName:{type:String,required:true,trim:true}, area:{type:String,required:true,trim:true},
  gender:{type:String,enum:["Male","Female","Any"],default:"Any"},
  sharingType:{type:String,enum:["single","double","triple"],default:"double"},
  rent:{type:Number,required:true,min:0}, availableBeds:{type:Number,default:1,min:1},
  description:{type:String,default:"",trim:true}, contactPhone:{type:String,default:"",trim:true},
  status:{type:String,enum:["Active","Inactive"],default:"Active"}
},{timestamps:true});
module.exports=mongoose.model("RoommateListing",schema);
