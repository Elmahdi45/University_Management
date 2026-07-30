const express=require('express');
const router=express.Router();

const {
     authentificationSecurity
}=require('../middlwares/protectedAuth')

const authorize=require('../middlwares/Authorize');

const {
        createDepartment,
         getDepartments,
         getOneDepartment,
         editDepartment,
         deleteDepartment
        



}=require('../controllers/departmentController');

router.post('/',authentificationSecurity,authorize(["Admin"]),createDepartment);
router.get('/',authentificationSecurity,authorize(["Admin","Registrar","Teacher","Student"]),getDepartments);
router.get('/:id',authentificationSecurity,authorize(["Admin","Registrar","Teacher","Student"]),getOneDepartment);
router.put('/edit-department/:id',authentificationSecurity,authorize(["Admin"]),editDepartment);
router.delete('/delete-department/:id',authentificationSecurity,authorize(["Admin"]),deleteDepartment);
module.exports=router;