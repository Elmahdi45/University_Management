const {pool}=require('../database/db');
const bcrypt=require('bcrypt');

async function createTeacher(req,res){
       try{
           const {first_name,last_name,password,phone,gender,department_id}=req.body;
           if(!first_name || !last_name || !password || !phone || !gender || !department_id){ 
                 return res.status(400).json({message:"All fields are required"});
           }
          const departement=await pool.query('select id,name from departments where id=$1',[department_id]);
           if(departement.rowCount===0){
              return res.status(404).json({message:"Department not found"});
           }
           const tempEmail= `temp_${Date.now()}@teacher.isga.ma`; 
           const role=await pool.query('select id from roles where name=$1',["Teacher"]);
           const role_id=role.rows[0].id;
           const hashedPassword=await bcrypt.hash(password,10);

           const insert=await pool.query('insert into users("first_name","last_name","email","password","phone","gender","role_id") values($1,$2,$3,$4,$5,$6,$7) returning id,email,first_name,last_name',[first_name,last_name,tempEmail,hashedPassword,phone,gender,role_id]);
           const user_id=insert.rows[0].id;

           const final_email=`${first_name.toLowerCase()}.${last_name.toLowerCase()}${user_id}@teacher.isga.ma`;
           const updateInsert=await pool.query('update users set email=$1 where id=$2',[final_email,user_id]);
          

           const get_department_id=departement.rows[0].id;

           await pool.query('insert into teacher_profiles("user_id","department_id") values($1,$2) returning*',[user_id,get_department_id]);
           return res.status(201).json({message:"Teacher Account Created"});
       }
       catch(err){
           console.log(err);
           return res.status(500).json({message:"Internal server error"});
       }
}
async function getTeachers(req,res){
      try{
           const result=await pool.query('select users.id,users.first_name,users.last_name,users.email,users.phone,users.gender,users.role_id,teacher_profiles.department_id,departments.name as department_name from users join teacher_profiles on users.id=teacher_profiles.user_id join departments on teacher_profiles.department_id=departments.id');
           if(result.rowCount===0){
               return res.status(404).json({message:"No teachers found"});
           }
           return res.status(200).json(result.rows);
      }
      catch(err){
         console.log(err);
         return res.status(500).json({message:"Internal server error"});
      }
}
async function getOneTeacher(req,res){ 
        try{
               const id=Number(req.params.id);
               if(isNaN(id)){
                   return res.status(400).json({message:"Invalid teacher id"});
               }
            const result=await pool.query('select users.id,users.first_name,users.last_name,users.email,users.phone,users.gender,users.role_id,teacher_profiles.department_id,departments.name as department_name from users join teacher_profiles on users.id=teacher_profiles.user_id join departments on teacher_profiles.department_id=departments.id where users.id=$1',[id]);
            if(result.rowCount===0){
                 return res.status(404).json({message:"Teacher not found"});
            }
            return res.status(200).json(result.rows[0]);
        }
        catch(err){
              console.log(err);
              res.status(500).json({message:"Internal server error"});
        }
}
async function editTeacher(req,res){
       try{
            const id=Number(req.params.id);
            if(isNaN(id)){
                  return res.status(400).json({message:"Invalid teacher id"});
            }
            const {first_name,last_name,phone,gender}=req.body;
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
                  return res.status(404).json({message:"No values to edit"});
            }
            values.push(id);
            const update=await pool.query(`update users set ${queries.join(', ')} where id=$${values.length} returning id,first_name,last_name,email,phone,gender`,values);
            if(update.rowCount===0){
                  return res.status(404).json({message:"Teacher not found"});
            }
            return res.status(200).json(update.rows[0]);

       }
       catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
       }
}

async function deleteTeacher(req,res){
      try{
           const id=Number(req.params.id);
           if(isNaN(id)){
               return res.status(400).json({message:"Invalid Teacher Id"});
           }
           
           const result=await pool.query('delete from users where id=$1 returning id,first_name,email',[id]);
           if(result.rowCount===0){
               return res.status(404).json({message:"No teacher found"});
           }
           return res.status(200).json({message:"Teacher deleted"});
      }
      catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }


}
module.exports={
      createTeacher,
      getTeachers,
      getOneTeacher,
      editTeacher,
      deleteTeacher
}