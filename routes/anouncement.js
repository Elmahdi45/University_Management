const express=require('express');
const router=express.Router();


const authorize=require('../middlwares/Authorize');

const {
       authentificationSecurity
}=require('../middlwares/protectedAuth');

const {
     createAnouncement,
     getAnouncements,
       getOneAnouncement,
      editAnouncement,
      deleteAnouncement
}=require('../controllers/anouncementController');

router.post('/',authentificationSecurity,authorize(["Admin","Registrar"]),createAnouncement);
router.get('/',authentificationSecurity,authorize(["Admin","Registrar","Student","Teacher"]),getAnouncements);
router.get('/:id',authentificationSecurity,authorize(["Admin","Registrar","Student","Teacher"]),getOneAnouncement);
router.put('/edit-announcement/:id',authentificationSecurity,authorize(["Admin","Registrar"]),editAnouncement);
router.delete('/delete-announcement/:id',authentificationSecurity,authorize(["Admin","Registrar"]),deleteAnouncement);

module.exports=router;