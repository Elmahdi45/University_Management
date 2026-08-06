const {pool}=require('../database/db');

async function getAdmin(req,res){
      try{
           const result=await pool.query('select email,first_name,last_name,phone,gender from users where role_id=1');
           if(result.rowCount===0){
              return res.status(404).json({message:"Admin not found"});
           }
           return res.status(200).json({message:"Data retrieved ", admin:result.rows});
      }
      catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}
async function getMe(req, res) {
    try {
        const user_id = req.user.id;

        const result=await pool.query('select email,first_name,last_name,phone,gender from users where id=$1',[user_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        return res.status(200).json({
            message: "Admin retrieved",
            admin: result.rows[0]
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports={
     getAdmin,
     getMe
}