const express=require('express');
const router=express.Router();

const {
     authentificationSecurity
}=require('../middlwares/protectedAuth')
const authorize=require('../middlwares/Authorize');
const {
     getProfile,
     updatePassword
}=require("../controllers/userController")

router.get('/',authentificationSecurity,getProfile);
router.put('/updateProfile',authentificationSecurity,authorize(["Admin","Registrar","Teacher","Student"]),updatePassword);

module.exports=router;




