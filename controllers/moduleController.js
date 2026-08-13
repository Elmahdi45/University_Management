const {pool}=require('../database/db');

async function createModule(req,res){
      try{  
           const {name,coefficient,semester}=req.body;
           if(!name || !coefficient || !semester){
               return res.status(400).json({message:"All fields are required"});
           }
           const checkModulename=await pool.query('select * from modules where name=$1',[name]);
           if(checkModulename.rowCount>0){
               return res.status(409).json({message:"Module already exists"});
           }
           const result=await pool.query('insert into modules("name","semester","coefficient") values($1,$2,$3) returning *',[name,coefficient,semester]);
           if(result.rowCount===0){
                return res.status(404).json({message:"No modules found"});
           }
           return res.status(201).json({
              message:"Module created",
              module:result.rows[0]
           })
      }
      catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}
async function getModules(req,res){
       try{
            const result=await pool.query('select * from modules');
            if(result.rowCount===0){
                  return res.status(404).json({message:"no modules found"});
            }
            return res.status(200).json(result.rows);
       }
       catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
       }
}
async function getMyModules(req, res) {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT
        m.id,
        m.name,
        m.semester,
        m.coefficient,
        u.first_name AS teacher_first_name,
        u.last_name AS teacher_last_name

      FROM student_profiles sp

      JOIN enrollment e
        ON e.student_id = sp.id

      JOIN modules m
        ON m.id = e.module_id

      LEFT JOIN teaching_assignments ta
        ON ta.module_id = m.id

      LEFT JOIN teacher_profiles tp
        ON tp.id = ta.teacher_id

      LEFT JOIN users u
        ON u.id = tp.user_id

      WHERE sp.user_id = $1

      ORDER BY m.name ASC
    `, [userId]);

    return res.status(200).json({
      modules: result.rows
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
async function getOneModule(req,res){
     try{
          const id=Number(req.params.id);
          if(isNaN(id)){ 
              return res.status(400).json({message:"Invalid module id"});
          }
          const result=await pool.query('select * from modules where id=$1',[id]);
          if(result.rowCount===0){
               return res.status(404).json({message:"No module found"});
          }
          return res.status(200).json(result.rows[0]);
     }
     catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
     }
}
async function editModule(req,res){
       try{
           const id=Number(req.params.id);
           if(isNaN(id)){
               return res.status(400).json({message:"Invalid module id"});
           }
           const {name,coefficient,semester}=req.body;
           const queries=[];
           const values=[];

           if(name){
              queries.push(`name=$`+(values.length+1));
              values.push(name);
           }
           if(coefficient){
              queries.push(`coefficient=$`+(values.length+1));
              values.push(coefficient);
           }
           if(semester){
              queries.push(`semester=$`+(values.length+1));
              values.push(semester);
           }
           if(queries.length===0){
               return res.status(404).json({message:"No fields to edit"});
           }
           values.push(id);
           const result=await pool.query(`update modules set ${queries.join(', ')} where id=$${values.length} returning *`,values);
           if(result.rowCount===0){
              return res.status(404).json({message:"No modules found"});
           }
           return res.status(200).json({
               message:"Module update",
               module:result.rows[0] 
          });

       }
       catch(err){ 
           console.log(err);
           return res.status(500).json({message:"Internal server error"});
       }
}
async function deleteModule(req,res){
      try{
           const id=Number(req.params.id);
           if(isNaN(id)){
               return res.status(400).json({message:"Invalid module id"});
           }
           const result=await pool.query('delete from modules where id=$1 returning *',[id]);
           if(result.rowCount===0){
              return res.status(404).json({message:"No module found"});
           }
           return res.status(200).json({message:"Module deleted"});
      } 
      catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}




module.exports={
      createModule,
      getModules,
      getOneModule,
      editModule,
      deleteModule,
      getMyModules
}