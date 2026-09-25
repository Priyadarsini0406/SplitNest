const Property = require('../models/property.model');
const getPublicProperties = async (req,res,next)=>{try{const rows=await Property.find({status:'Active'}).sort({createdAt:-1});res.json({success:true,count:rows.length,data:rows});}catch(e){next(e)}};
const getPublicPropertyById = async (req,res,next)=>{try{const row=await Property.findOne({_id:req.params.id,status:'Active'});if(!row)return res.status(404).json({success:false,message:'Property not found'});res.json({success:true,data:row});}catch(e){if(e.name==='CastError')return res.status(404).json({success:false,message:'Property not found'});next(e)}};
module.exports={getPublicProperties,getPublicPropertyById};
