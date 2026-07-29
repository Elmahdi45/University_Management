const express=require("express");
const { authentificationSecurity } = require("../middlwares/protectedAuth");
const authorize =require('../middlwares/Authorize');

const router=express.Router();
const {
     login
}=require('../controllers/authentification');



router.post('/login',login);
router.get('/profile',authentificationSecurity,(req,res)=>{
     res.json(req.user);
})

router.get(
    "/admin",
    authentificationSecurity,
    authorize(["Admin","Student"]),
    (req, res) => {
        res.json({
            message: "Welcome Admin!"
        });
    }
);
router.get("/student",authentificationSecurity,authorize(["Student"]));

module.exports=router;