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
    getMyStudentsGrades
}=require('../controllers/gradeController');

router.post('/',authentificationSecurity,authorize(["Admin","Teacher"]),createGrades);
router.get('/',authentificationSecurity,authorize(["Admin"]),getGrades);
router.get('/me',authentificationSecurity,authorize(["Student"]),getMyGrades);
router.get('/get-my-students',authentificationSecurity,authorize(["Teacher"]),getMyStudentsGrades);
module.exports=router;