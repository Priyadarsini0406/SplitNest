const express=require('express');
const {getPublicProperties,getPublicPropertyById}=require('../controllers/publicProperty.controller');
const router=express.Router();
router.get('/',getPublicProperties);
router.get('/:id',getPublicPropertyById);
module.exports=router;
