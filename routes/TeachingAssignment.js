const express=require('express');
const router=express.Router();

const { 
     authentificationSecurity
}=require('../middlwares/protectedAuth')

const authorize=require('../middlwares/Authorize');

const {
    createTeachingAssignment,
    getTeachingAssignment,
    getOneTeachingAssignment,
    getMyTeacherAssignment,
    getMyStudents,
    editTeachingAssignment,
    deleteTeachingAssignment,
    getMyTeachingAssignment
}=require('../controllers/TeachingAssignmentController');

router.post('/',authentificationSecurity,authorize(["Admin","Registrar"]),createTeachingAssignment);
router.get('/',authentificationSecurity,authorize(["Admin","Registrar"]),getTeachingAssignment);
router.get('/get-my-teacher',authentificationSecurity,authorize(["Admin","Registrar","Student"]),getMyTeacherAssignment);
router.get('/get-my-teachingassignment',authentificationSecurity,authorize(["Admin","Registrar","Teacher"]),getMyTeachingAssignment);
router.get('/get-my-students',authentificationSecurity,authorize(["Admin","Registrar","Teacher"]),getMyStudents);
router.get('/:id',authentificationSecurity,authorize(["Admin","Registrar"]),getOneTeachingAssignment);
router.put('/edit-teachingAssignment/:id',authentificationSecurity,authorize(["Admin","Registrar"]),editTeachingAssignment);
router.delete('/delete-teachingAssignment/:id',authentificationSecurity,authorize(["Admin","Registrar"]),deleteTeachingAssignment);


module.exports=router;