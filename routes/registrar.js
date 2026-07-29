const express=require('express');
const router=express.Router();


const {
    authentificationSecurity
}=require('../middlwares/protectedAuth')

const authorize=require('../middlwares/Authorize')
const {
    createRegistrar,
    getRegistrars,
    getOneRegistrar,
    editRegistrar,
    deleteRegistrar
}=require('../controllers/registrarController');

router.post('/',authentificationSecurity,authorize(["Admin"]),createRegistrar);
router.get('/',authentificationSecurity,authorize(["Admin"]),getRegistrars);
router.get('/:id',authentificationSecurity,authorize(["Admin"]),getOneRegistrar);
router.put('/edit-registrar/:id',authentificationSecurity,authorize(["Admin"]),editRegistrar);
router.delete('/delete/:id',authentificationSecurity,authorize(["Admin"]),deleteRegistrar);

module.exports=router;