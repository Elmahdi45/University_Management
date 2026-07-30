const {pool}=require('../database/db');

async function createDepartment(req,res){
       try{
            const {name}=req.body;
            const checkDepartment=await pool.query('select name from departments where name=$1',[name]);
            if(checkDepartment.rowCount>0){
                  return res.status(409).json({message:"Department already exists"});
            }
            const insert=await pool.query('insert into departments("name") values($1) returning id,name',[name]);
            if(insert.rowCount===0){
                  return res.status(404).json({message:"Department not found"});
            }
            return res.status(201).json({message:"Department created!"},insert.rows[0]);


       }
       catch(err){
           console.log(err);
           return res.status(500).json({message:"Internal server error"});
       }
}
async function getDepartments(req,res){
      try{
           const result=await pool.query('select * from departments');
           if(result.rowCount===0){
              return res.status(404).json({message:"No departments found"});
           }
           return res.status(200).json(result.rows);
      }
      catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}
async function getOneDepartment(req,res){
      try{
           const id=Number(req.params.id);
           if(isNaN(id)){
               return res.status(400).json({message:"Invalid department id"});
           }
           const result=await pool.query('select * from departments where id=$1',[id]);
           if(result.rowCount===0){
               return res.status(404).json({message:"Department not found"});
           }
           return res.status(200).json(result.rows[0]);
      }
      catch(err){
           console.log(err);
           return res.status(500).json({message:"Internal server error"});
      }
}
async function editDepartment(req,res){
       try{
           const id=Number(req.params.id);
           if(isNaN(id)){
               return res.status(400).json({message:"Invalid department id"});
           }
           const {name}=req.body;
           const queries=[];
           const values=[];
           if(name){
               queries.push(`name=$`+(values.length+1));
               values.push(name);
           }
           if(queries.length===0){
               return res.status(400).json({message:"There is nothing to edit"});
           }
           values.push(id);

           const result=await pool.query(`update departments set ${queries.join(', ')} where id=$${values.length} returning id,name`,values);
           if(result.rowCount===0){
               return res.status(404).json({message:"No department found"});
           }
           return res.status(200).json({message:"Department update"},result.rows[0]);

       }
        catch(err){
           console.log(err);
           return res.status(500).json({message:"Internal server error"});
      }

}
async function deleteDepartment(req,res){
       try{
           const id=Number(req.params.id);
           if(isNaN(id)){
               return res.status(400).json({message:"Invalid department id"});
           }

           const result=await pool.query('delete from departments where id=$1 returning *',[id]);
           if(result.rowCount===0){
              return res.status(404).json({message:"No department found"});
           } 
           return res.status(200).json({message:"Department deleted"});
       }
        catch(err){
           console.log(err);
           return res.status(500).json({message:"Internal server error"});
      }
}


module.exports={
       createDepartment,
       getDepartments,
       getOneDepartment,
       editDepartment,
       deleteDepartment
}