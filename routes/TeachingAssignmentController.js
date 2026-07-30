const express=require('express');
const router=express.Router();

const { 
     authentificationSecurity
}=require('../middlwares/protectedAuth')

const authorize=require('../middlwares/Authorize');

const {
    
}=require('../controllers/TeachingAssignmentController');


module.exports=router;