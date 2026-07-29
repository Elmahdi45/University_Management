const jwt=require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

function authentificationSecurity(req,res,next){
     const authHeader=req.headers.authorization;

     if(!authHeader){ 
          return res.status(401).json({message:"Header missing"});
     }
     const [bearer,token]=authHeader.split(" ");
     if(bearer!=="Bearer" || !token){
         return res.status(401).json({message:"Invalid token format"});
     }

     try{
         const decoded=jwt.verify(token,SECRET);
         req.user=decoded;
         next();
     }
     catch(err){
         return res.status(401).json({
             message:"invalid or expired token"
         })
     }
}

module.exports={
     authentificationSecurity
}