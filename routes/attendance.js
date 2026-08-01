const express=require('express');
const router=express.Router();

const authorize=require('../middlwares/Authorize');
const {
     authentificationSecurity
}=require('../middlwares/protectedAuth');

const {
     createAttendance,
     getAttendance,
     getAttendanceByClassAndModule,
     getMyAttendance,
     editAttendance,
     deleteAttendance
     
}=require('../controllers/attendanceController');

router.post('/',authentificationSecurity,authorize(["Admin","Teacher"]),createAttendance);
router.get('/',authentificationSecurity,authorize(["Admin","Teacher"]),getAttendance);
router.get('/class/:class_id/module/:module_id',authentificationSecurity,authorize(["Admin","Teacher"]));
router.get('/me',authentificationSecurity,authorize(["Admin","Student"]),getMyAttendance);
router.put('/edit-attendance/:id',authentificationSecurity,authorize(["Admin","Teacher"]),editAttendance);
router.delete('/delete-attendance/:id',authentificationSecurity,authorize(["Admin","Teacher"]),deleteAttendance);
module.exports=router;