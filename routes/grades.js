const express=require('express');
const router=express.Router();


const authorize=require('../middlwares/Authorize');
const {
     authentificationSecurity
}=require('../middlwares/protectedAuth');

const {
    createGrades,
    getGrades,
    getMyGrades,
    getMyStudentsGrades,
    getOneStudentGrades,
    editStudentGrades,
    deleteGrade
}=require('../controllers/gradeController');

router.post('/',authentificationSecurity,authorize(["Admin","Teacher"]),createGrades);
router.get('/',authentificationSecurity,authorize(["Admin"]),getGrades);
router.get('/me',authentificationSecurity,authorize(["Student"]),getMyGrades);
router.get('/get-my-students',authentificationSecurity,authorize(["Teacher"]),getMyStudentsGrades);
router.get('/:id',authentificationSecurity,authorize(["Admin","Teacher"]),getOneStudentGrades);
router.put('/grades/:id',authentificationSecurity,authorize(["Admin","Teacher"]),editStudentGrades);
router.delete('/delete-grade/:id',authentificationSecurity,authorize(["Admin"]),deleteGrade);
module.exports=router;