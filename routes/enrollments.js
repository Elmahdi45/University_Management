const express=require('express');

const router=express.Router();
const {
     authentificationSecurity
}=require('../middlwares/protectedAuth');

const authorize=require('../middlwares/Authorize');

const {
      createEnrollment,
      getEnrollment,
      getOneEnrollment,
      editEnrollment,
      deleteEnrollment

}=require('../controllers/enrollmentController');

router.post('/',authentificationSecurity,authorize(["Admin","Registrar"]),createEnrollment);
router.get('/',authentificationSecurity,authorize(["Admin","Registrar"]),getEnrollment);
router.get('/:id',authentificationSecurity,authorize(["Admin","Registrar"]),getOneEnrollment);
router.put('/edit-enrollment/:id',authentificationSecurity,authorize(["Admin","Registrar"]),editEnrollment);
router.delete('/delete-enrollment/:id',authentificationSecurity,authorize(["Admin"]),deleteEnrollment);

module.exports=router;