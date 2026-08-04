const express=require('express');
const router=express.Router();


const authorize=require('../middlwares/Authorize');
const {
     authentificationSecurity

}=require('../middlwares/protectedAuth')
const {
     createAssignment,
     getAssignment,
     getMyAssignments,
     getOneAssignment,
     editAssignment,
     deleteAssignment
}=require('../controllers/assignmentController');

router.post('/',authentificationSecurity,authorize(["Admin","Teacher"]),createAssignment);
router.get('/',authentificationSecurity,authorize(["Admin","Teacher"]),getAssignment);
router.get('/me',authentificationSecurity,authorize(["Admin","Student"]),getMyAssignments);
router.get('/:id',authentificationSecurity,authorize(["Admin","Student","Teacher"]),getOneAssignment);
router.put('/edit-assignment/:id',authentificationSecurity,authorize(["Admin","Teacher"]),editAssignment);
router.delete('/delete-assignment/:id',authentificationSecurity,authorize(["Admin","Teacher"]),deleteAssignment);

module.exports=router;