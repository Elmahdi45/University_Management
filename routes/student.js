const express=require('express');
const router=express.Router();
const {
     authentificationSecurity  
}=require('../middlwares/protectedAuth');

const authorize=require('../middlwares/Authorize');

const {
    createStudent,
    getStudents,
    getOneStudent,
    editStudent,
    deleteStudent
}=require('../controllers/studentController');

router.post('/',authentificationSecurity,authorize(["Admin","Registrar"]),createStudent);
router.get('/',authentificationSecurity,authorize(["Admin","Registrar"]),getStudents);
router.get('/:id',authentificationSecurity,authorize(["Admin","Registrar"]),getOneStudent)
router.put('/edit-student/:id',authentificationSecurity,authorize(["Admin","Registrar"]),editStudent);
router.delete('/delete-student/:id',authentificationSecurity,authorize(["Admin","Registrar"]),deleteStudent);
module.exports=router;