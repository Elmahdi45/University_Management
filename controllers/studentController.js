const {pool}=require('../database/db');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');


async function createStudent(req,res){
       try{
            const {first_name,last_name,password,phone,gender,class_id}=req.body;
            if(!first_name||!last_name||!password||!phone||!gender){
                 return res.status(400).json({message:"All fields are required"});
            }
            
            const role=await pool.query('select id from roles where name=$1',["Student"]);
            const roleId=role.rows[0].id;
            const tempEmail = `temp_${Date.now()}@student.isga.ma`; 
            const hashedPassword=await bcrypt.hash(password,10);
            
            const insert=await pool.query('insert into users("first_name","last_name","email","password","phone","gender","role_id") values($1,$2,$3,$4,$5,$6,$7) returning first_name,role_id,last_name,email,id',[first_name,last_name,tempEmail,hashedPassword,phone,gender,roleId]);
            const user_id=insert.rows[0].id;
            const student_number = `ST${new Date().getFullYear()}${user_id}`;
            const final_email=`${first_name.toLowerCase()}.${last_name.toLowerCase()}${user_id}@student.isga.ma`;
            await pool.query('update users set email=$1 where id=$2',[final_email,user_id]);
            const checkClass=await pool.query('Select id from classes where id=$1',[class_id]);

            if(checkClass.rowCount===0){
                 return res.status(404).json({message:"Class not found"});
            }

            await pool.query('insert into student_profiles("user_id","student_number","class_id") values($1,$2,$3) returning user_id,student_number,class_id',[user_id,student_number,class_id]);
            return res.status(201).json({message:"Student Account Created"});
       } 
       catch(err){
           console.log(err);
           return res.status(500).json({message:"Internal server error"});
       }

    
}
async function getStudents(req,res){
      try{
          const result = await pool.query('select users.id, users.first_name,users.last_name,users.email,users.phone,users.gender,users.role_id, roles.name as role , classes.name as class_name,student_profiles.student_number as student_number ,student_profiles.class_id as class_id from users join roles on users.role_id=roles.id join student_profiles on users.id=student_profiles.user_id join classes on student_profiles.class_id=classes.id');
          if(result.rowCount===0){
              return res.status(404).json({message:"There are no students yet"});
          }
          return res.status(200).json(result.rows);
      }
      catch(err){
         console.log(err);
         return res.status(500).json({message:"Internal server error"});
      }
}

async function getOneStudent(req,res){
      try{ 
          const id=Number(req.params.id);
          if(isNaN(id)){
             return res.status(400).json({message:"Invalid student id"});
          }
        const result = await pool.query('select users.first_name,users.last_name,users.email,users.phone,users.gender,users.role_id, roles.name as role , classes.name as class_name,student_profiles.student_number as student_number ,student_profiles.class_id as class_id from users join roles on users.role_id=roles.id join student_profiles on users.id=student_profiles.user_id join classes on student_profiles.class_id=classes.id where roles.name=$1 and users.id=$2',["Student",id]);
        if(result.rowCount===0){
             return res.status(404).json({message:"Student not found"});
        }
        return res.json(result.rows[0]);

      }
      catch(err){
         console.log(err);
         return res.status(500).json({message:"Internal server error"});
      }
}
async function editStudent(req,res){
       try{
           const id=Number(req.params.id);
           const {first_name,last_name,phone,gender}=req.body;
           if(isNaN(id)){ 
                return res.status(400).json({message:"Invalid student id"});
           }
           const queries=[];
           const values=[];
          if(first_name){
                queries.push(`first_name=$`+(values.length+1));
                values.push(first_name);
          }
          if(last_name){
               queries.push(`last_name=$`+(values.length+1));
               values.push(last_name);
          }
          if(phone){ 
                queries.push(`phone=$`+(values.length+1));
               values.push(phone);
          }
          if(gender){ 
               queries.push(`gender=$`+(values.length+1));
               values.push(gender);
          }

          if(queries.length===0){
                return res.status(404).json({message:"No fields to update"});
          }
          values.push(id);
          const result=await pool.query(`update users set ${queries.join(', ')} where id=$${values.length} returning first_name,last_name,gender,phone`,values);
          if(result.rowCount===0){
                return res.status(404).json({message:"Student not found"});
          }
          return res.status(200).json(result.rows[0]);
       }
       catch(err){
           console.log(err);
           return res.status(500).json({message:"Internal server error"});
       }
}

async function deleteStudent(req,res){
       try{
            const id=Number(req.params.id);
            if(isNaN(id)){
                return res.status(400).json({message:"Invalid student id"});
            }
            const result=await pool.query('delete from users where id=$1 returning *',[id]);
            if(result.rowCount===0){
                return res.status(404).json({message:"Student not found"});
            }
            return res.status(200).json({message:"Student deleted"});
       }
       catch(err){
           console.log(err);
           return res.status(500).json({message:"Internal server error"});
       }
}
module.exports={
     createStudent,
     getStudents,
     getOneStudent,
     editStudent,
     deleteStudent
}