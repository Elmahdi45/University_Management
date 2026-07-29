const {pool}=require('../database/db');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

const SECRET="initialtest";

/*async function register(req,res){
      try{
           const {first_name,last_name,email,password,phone,gender,role}=req.body;
           if(!first_name || !last_name || !email || !password || !phone || !gender){
               return res.status(400).json({message:"All fields are required"});
           }
           const checkEmail=await pool.query('select * from users where email=$1',[email]);
           if(checkEmail.rowCount>0){ 
               return res.status(409).json({message:"Email already exists"});
           }
           const hashPassword=await bcrypt.hash(password,10);
           const result=await pool.query('insert into users("first_name","last_name","email","password","phone","gender","role_id") values($1,$2,$3,$4,$5,$6,$7) returning id,email,first_name,last_name',[first_name,last_name,email,hashPassword,phone,gender,role]);
           return res.status(201).json({message:"Account created", user: result.rows[0]});
           
          

      }
      catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}*/

async function login(req,res){
      try{
          const {email,password}=req.body;
          if(!email || !password){
              return res.status(400).json({message:"Fields are required"});
          }
                  

          const checkEmail=await pool.query("select users.id,users.email, users.password,roles.name as role from users join roles on users.role_id=roles.id where users.email=$1",[email]);
          if(checkEmail.rowCount===0){
              return res.status(401).json({message:"Invalid email or password"});
          }
          const user=checkEmail.rows[0];
          const dataPassword=user.password;

          const compare=await bcrypt.compare(password,dataPassword);
          if(!compare){
              return res.status(401).json({message:"Invalid email or password"});
          }
          const token=jwt.sign(
            {
                 id:user.id,
                 email:user.email,
                 role:user.role
            },
            SECRET,
            {
                 expiresIn:"1d"
            }
          )
         return res.status(200).json({message:"Login success",token});

      }
      catch(err){
         console.log(err);
         res.status(500).json({message:"Internal server error"});
      }
}

module.exports={
      login,
}