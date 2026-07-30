const express=require('express');
const router=express.Router();

const authorize=require('../middlwares/Authorize');

const {
      authentificationSecurity
}=require('../middlwares/protectedAuth');

const {
      createClass,
      getClasses,
      getOneClass,
      editClass,
      deleteClass
}=require('../controllers/classController');


router.post('/',authentificationSecurity,authorize(["Admin","Registrar"]),createClass);
router.get('/',authentificationSecurity,authorize(["Admin","Registrar","Student","Teacher"]),getClasses);
router.get('/:id',authentificationSecurity,authorize(["Admin","Registrar","Student","Teacher"]),getOneClass);
router.put('/edit-class/:id',authentificationSecurity,authorize(["Admin","Registrar"]),editClass);
router.delete('/delete-class/:id',authentificationSecurity,authorize(["Admin","Registrar"]),deleteClass);


module.exports=router;