const express=require('express');
const router=express.Router();

const {
     authentificationSecurity
}=require('../middlwares/protectedAuth')

const {
      getProfile
}=require("../controllers/userController")

router.get('/',authentificationSecurity,getProfile);

module.exports=router;




