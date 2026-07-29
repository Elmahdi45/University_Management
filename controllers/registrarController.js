const {pool}=require('../database/db');
const bcrypt=require('bcrypt')

async function createRegistrar(req,res){
        try{
              const {first_name,last_name,password,phone,gender}=req.body;
              if(!first_name || !last_name || !password || !phone || !gender ){
                   return res.status(400).json({message:"All fields are required"});
              }

              const role=await pool.query('select id from roles where name=$1',["Registrar"]);

              if(role.rowCount===0){
                  return res.status(404).json({message:"Registrar not found"});
              }
              const roleId=role.rows[0].id;

              const tempEmail = `temp_${Date.now()}@registrar.isga.ma`;             
              const hashedPassword=await bcrypt.hash(password,10);

              const result=await pool.query('insert into users("first_name","last_name","email","phone","password","gender","role_id") values($1,$2,$3,$4,$5,$6,$7) returning id,first_name,email',[first_name,last_name,tempEmail,phone,hashedPassword,gender,roleId]);
              const user=result.rows[0];
              const userId=user.id;
              const final_email=`${first_name.toLowerCase()}.${last_name.toLowerCase()}${userId}@registrar.isga.ma`;
              await pool.query('update users set email=$1 where id=$2',[final_email,userId]);
 
             await pool.query(
                  `INSERT INTO registrar_profiles (user_id)
                  VALUES ($1)`,
                  [userId]
             );
             return res.status(201).json({message:"Registrar created", email: final_email});


        }
        catch(err){
             console.log(err);
             return res.status(500).json({message:"Internal server error"});
        }
}

async function getRegistrars(req,res){
        try{
             const result=await pool.query(
                  'select users.id,users.first_name,users.last_name,users.email,users.phone,users.gender,users.role_id,users.created_at ,roles.name as role  from users join roles on users.role_id=roles.id where roles.name=$1',["Registrar"]

             );
             if(result.rowCount===0){
                    return res.status(404).json({message:"Registrar not found"});
             }
             return res.status(200).json(result.rows);
        }
        catch(err){
             console.log(err);
             return res.status(500).json({message:"Internal server error"});
        }
}

async function getOneRegistrar(req,res){
        try{
             const id=Number(req.params.id);

             if(isNaN(id)){ 
                    return res.status(400).json({message:"Invalid registrar id"});
             }
             const result=await pool.query(
             'select users.id,users.first_name,users.last_name,users.email,users.phone,users.gender,users.role_id,users.created_at ,roles.name as role  from users join roles on users.role_id=roles.id where roles.name=$1 and users.id=$2',["Registrar",id]
 
             );

             if(result.rowCount===0){
                   return res.status(404).json({message:"Registrar not found"});
             }
            return res.status(200).json(result.rows[0]);


        }
        catch(err){
             console.log(err);
             return res.status(500).json({message:"Internal server error"});
        }
}
async function editRegistrar(req,res){
        const id=Number(req.params.id);
        const {first_name,last_name,phone,gender}=req.body;
        if(isNaN(id)){
             return res.status(400).json({message:"Invalid registrar id"});
        }

       const updates=[];
       const values=[];
       
       if(first_name){
             updates.push("first_name=$"+(values.length+1));
             values.push(first_name);
       }
       if(last_name){
             updates.push("last_name=$"+(values.length+1));
             values.push(last_name);
       }
       if(phone){
             updates.push("phone=$"+(values.length+1));
             values.push(phone);
       }
       if(gender){
             updates.push("gender=$"+(values.length+1));
             values.push(gender);
       }
      if (updates.length === 0) {
      return res.status(400).json({
            message: "No fields to update"
      });
      }

        values.push(id);
        const result=await pool.query(`update users set ${updates.join(', ')} where id=$${values.length} returning first_name,last_name,email,phone,gender`,values);
        
        if(result.rowCount===0){
             return res.status(404).json({message:"Cannot find registrar"});
        }
        return res.json(result.rows[0]);


}

async function deleteRegistrar(req,res){
       try{
             const id=Number(req.params.id);
             if(isNaN(id)){
                   return res.status(400).json({message:"Invalid registrar id"});
             }
             const result=await pool.query('delete from users where id=$1 returning first_name,last_name,id,email',[id]);
             if(result.rowCount===0){
                   return res.status(404).json({message:"Registrar not found"});
             }
             return res.status(200).json({message:"Registrar deleted"});
       }
       catch(err){
             console.log(err);
             return res.status(500).json({message:"Internal server error"});
       }

}

module.exports={
      createRegistrar,
      getRegistrars,
      getOneRegistrar,
      editRegistrar,
      deleteRegistrar
}


