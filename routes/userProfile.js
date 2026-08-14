const express=require('express');
const router=express.Router();

const {
     authentificationSecurity
}=require('../middlwares/protectedAuth')
const authorize=require('../middlwares/Authorize');
const {
      getProfile
}=require("../controllers/userController")

router.get('/',authentificationSecurity,getProfile);
router.put('/update-profile',authentificationSecurity,authorize(["Admin","Registrar","Teacher","Student"]));

module.exports=router;




