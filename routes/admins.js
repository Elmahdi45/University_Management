const express=require('express');
const router=express.Router();

const {
    authentificationSecurity
}=require('../middlwares/protectedAuth');

const authorize=require('../middlwares/Authorize');

const {
       getAdmin,
       getMe
}=require('../controllers/adminController');

router.get('/',authentificationSecurity,authorize(["Admin"]),getAdmin);
router.get("/me", authentificationSecurity, authorize("Admin"), getMe);

module.exports=router;