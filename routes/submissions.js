const express=require('express');

const router=express.Router();

const authorize=require('../middlwares/Authorize');
const{
    authentificationSecurity
}=require('../middlwares/protectedAuth');

const {
    createSubmission,
    getMyStudentsSubmissions,
    getMySubmissions,
    getOneSubmission,
    editSubmission,
    deleteSubmission,
    gradeSubmission

}=require('../controllers/submissionsController');


router.post('/',authentificationSecurity,authorize(["Student"]),createSubmission);
router.get('/',authentificationSecurity,authorize(["Teacher"]),getMyStudentsSubmissions);
router.get('/me',authentificationSecurity,authorize(["Student"]),getMySubmissions);
router.get('/:id',authentificationSecurity,authorize(["Admin","Teacher","Student"]),getOneSubmission);
router.put('/edit-submission',authentificationSecurity,authorize(["Student"]),editSubmission);
router.delete('/delete-submission',authentificationSecurity,authorize(["Student"]),deleteSubmission);
router.patch(
    "/submissions/:id/grade",
    authentificationSecurity,
    authorize(["Teacher"]),
    gradeSubmission
);



module.exports=router;