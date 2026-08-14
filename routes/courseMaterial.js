const express=require('express');
const router=express.Router();


const authorize=require('../middlwares/Authorize');
const {
    authentificationSecurity
}=require('../middlwares/protectedAuth');

const {
     createCourseMaterial,
     getCourseMaterial,
     getMyCourseMaterials,
     getOneCourseMaterial,
     editCourseMaterial,
     deleteCourseMaterial
}=require('../controllers/courseMaterialController');


router.post('/',authentificationSecurity,authorize(["Admin","Teacher"]),createCourseMaterial);
router.get('/',authentificationSecurity,authorize(["Admin","Teacher"]),getCourseMaterial);
router.get('/me',authentificationSecurity,authorize(["Student"]),getMyCourseMaterials);
router.get('/:id',authentificationSecurity,authorize(["Admin","Teacher","Student"]),getOneCourseMaterial);
router.put('/edit-course-materials/:id',authentificationSecurity,authorize(["Admin","Teacher"]),editCourseMaterial);
router.delete('/delete-course-materials/:id',authentificationSecurity,authorize(["Admin","Teacher"]),deleteCourseMaterial);

module.exports=router;