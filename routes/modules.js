const express=require('express');

const router=express.Router();

const {
     authentificationSecurity
}=require('../middlwares/protectedAuth')

const authorize=require('../middlwares/Authorize');

const {
     createModule,
     getModules,
     getOneModule,
     editModule,
     deleteModule,
     getMyModules

}=require('../controllers/moduleController');

router.post('/',authentificationSecurity,authorize(["Admin","Registrar"]),createModule);
router.get('/',authentificationSecurity,authorize(["Admin","Registrar","Student","Teacher"]),getModules);
router.get('/my-modules',authentificationSecurity,authorize(["Student"]),getMyModules);
router.get('/:id',authentificationSecurity,authorize(["Admin","Registrar","Student","Teacher"]),getOneModule);
router.put('/edit-module/:id',authentificationSecurity,authorize(["Admin","Registrar"]),editModule);
router.delete('/delete-module/:id',authentificationSecurity,authorize(["Admin"]),deleteModule);

module.exports=router;