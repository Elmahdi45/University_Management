const express=require('express');
const router=express.Router();

const authorize=require('../middlwares/Authorize');
const {
      authentificationSecurity
}=require('../middlwares/protectedAuth');

const {
       createTeacher,
       getTeachers,
       getOneTeacher,
       editTeacher,
       deleteTeacher
}=require('../controllers/teacherController');

router.post('/',authentificationSecurity,authorize(["Admin","Registrar"]),createTeacher);
router.get('/',authentificationSecurity,authorize(["Admin","Registrar"]),getTeachers);
router.get('/:id',authentificationSecurity,authorize(["Admin","Registrar"]),getOneTeacher);
router.put('/edit-teacher/:id',authentificationSecurity,authorize(["Admin","Registrar"]),editTeacher);
router.delete('/delete-teacher/:id',authentificationSecurity,authorize(["Admin","Registrar"]),deleteTeacher);


module.exports=router;