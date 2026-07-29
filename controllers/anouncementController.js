const {pool}=require('../database/db');

async function createAnouncement(req,res){
       try{
            const {title,content}=req.body;
            const created_by=req.user.id;

            if(!title || !content){
                  return res.status(400).json({message:"All fields are required"});
            }
            const result=await pool.query('insert into announcements("title","content","created_by") values($1,$2,$3) returning *',[title,content,created_by]);
            if(result.rowCount===0){
                   return res.status(404).json({message:"Announcement not found"});
            }
            return res.status(201).json(result.rows[0]);
       }
       catch(err){
           console.log(err);
           return res.status(500).json({message:"Internal server error"});
       }
}
async function getAnouncements(req,res){
       try{
             const result=await pool.query('select * from announcements');
             if(result.rowCount===0){ 
                  return res.status(404).json({message:"No announcements found"});
             }
             return res.status(200).json(result.rows);
       }
       catch(err){
           console.log(err);
           return res.status(500).json({message:"Internal server error"});
       }
}
async function getOneAnouncement(req,res){
       try{
            const id=Number(req.params.id);
            if(isNaN(id)){
                  return res.status(400).json({message:"Invalid announcement id"});
            }
            const result=await pool.query('select * from announcements where id=$1',[id]);
            if(result.rowCount===0){
                  return res.status(404).json({message:"No announcement found"});
            }
            return res.status(200).json(result.rows[0]);
       } 
       catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
       }
}

async function editAnouncement(req,res){
      try{ 
           const id=Number(req.params.id);
            if(isNaN(id)){
                  return res.status(400).json({message:"Invalid announcement id"});
            }
           const {title,content}=req.body;
           const queries=[];
           const values=[];

           if(title){
               queries.push(`title=$`+(values.length+1));
               values.push(title);   
           }
           if(content){
              queries.push(`content=$`+(values.length+1));
              values.push(content);
           }
           if(queries.length===0){
               return res.status(404).json({message:"No announcements to edit"});
           }

           values.push(id);

           const result=await pool.query(`update announcements set ${queries.join(', ')} where id=$${values.length} returning *`,values);
           if(result.rowCount===0){
               return res.status(404).json({message:"No announcement found"});
           }
           return res.status(200).json(result.rows[0]);
           
      }
      catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}
async function deleteAnouncement(req,res){
      try{
         const id=Number(req.params.id);
          if(isNaN(id)){
                  return res.status(400).json({message:"Invalid announcement id"});
         }
         const result=await pool.query('delete from announcements where id=$1 returning*',[id]);
         if(result.rowCount===0){
              return res.status(404).json({message:"No announcement found"});
         }
         return res.status(200).json({message:"Announcement deleted"});


      }
      catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}

module.exports={ 
      createAnouncement,
      getAnouncements,
      getOneAnouncement,
      editAnouncement,
      deleteAnouncement
}