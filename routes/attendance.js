const express=require('express');
const router=express.Router();

const authorize=require('../middlwares/Authorize');
const {
     authentificationSecurity
}=require('../middlwares/protectedAuth');

const {
     
     
}=require('../controllers/attendanceController');

module.exports=router;