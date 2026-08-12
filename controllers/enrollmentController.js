const {pool}=require('../database/db');

async function createEnrollment(req,res){
      try{
           const {student_id,module_id}=req.body;
           const userId=req.user.id;
           
           if(!student_id || !module_id){
                return res.status(400).json({message:"All fields are required"});
           }

           const checkStudent=await pool.query('select * from student_profiles where id=$1',[student_id]);
           if(checkStudent.rowCount===0){
               return res.status(404).json({message:"No student found"});
           }
           const checkModule=await pool.query('select * from modules where id=$1',[module_id]);
           if(checkModule.rowCount===0){
                   return res.status(404).json({message:"No module found"});
           }

           const alreadyEnrolled = await pool.query(
                    `SELECT * FROM enrollment
                    WHERE student_id = $1 AND module_id = $2`,
                    [student_id, module_id]
          );

          if (alreadyEnrolled.rowCount > 0) {
                    return res.status(409).json({
                        message: "Student is already enrolled in this module."
                    });
           }

           const enroll=await pool.query('insert into enrollment("student_id","module_id","created_by") values($1,$2,$3) returning *',[student_id,module_id,userId]);
           if(enroll.rowCount===0){
               return res.status(404).json({message:"No module or student found to enroll"});
           }
           return res.status(201).json({
               message:"Enrolled!",
               enrollment:enroll.rows[0]
           })

      }
      catch(err){ 
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}

async function getEnrollment(req, res) {
    try {

        const result = await pool.query(`
            SELECT
                e.id,
                e.student_id,
                e.module_id,

                m.name AS module_name,
                m.semester,
                m.coefficient,

                student.first_name AS student_first_name,
                student.last_name AS student_last_name,

                creator.first_name AS created_by_first_name,
                creator.last_name AS created_by_last_name,

                e.created_at

            FROM enrollment e

            JOIN student_profiles sp
                ON e.student_id = sp.id

            JOIN users student
                ON sp.user_id = student.id

            JOIN modules m
                ON e.module_id = m.id

            JOIN users creator
                ON e.created_by = creator.id
        `);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No enrollments found"
            });
        }

        return res.status(200).json(result.rows);

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getOneEnrollment(req,res){
      try{
          const id=Number(req.params.id);
          if(isNaN(id)){
              return res.status(400).json({message:"Invalid enrollment id"});
          }
          const result = await pool.query(`
            SELECT
                e.id,
                e.student_id,
                e.module_id,

                m.name AS module_name,
                m.semester,
                m.coefficient,

                student.first_name AS student_first_name,
                student.last_name AS student_last_name,

                creator.first_name AS created_by_first_name,
                creator.last_name AS created_by_last_name,

                e.created_at

            FROM enrollment e

            JOIN student_profiles sp
                ON e.student_id = sp.id

            JOIN users student
                ON sp.user_id = student.id

            JOIN modules m
                ON e.module_id = m.id

            JOIN users creator
                ON e.created_by = creator.id

            where e.id=$1
        `,[id]);
         
        if(result.rowCount===0){
              return res.status(404).json({message:"No enrollment found"});
        }
        return res.status(200).json(result.rows[0]);
      }

      catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}

async function editEnrollment(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid enrollment id"
            });
        }

        const { student_id, module_id } = req.body;

        const queries = [];
        const values = [];

        // Check student
        const checkStudent = await pool.query(
            "SELECT * FROM student_profiles WHERE id = $1",
            [student_id]
        );

        if (checkStudent.rowCount === 0) {
            return res.status(404).json({
                message: "No student found"
            });
        }

        // Check module
        const checkModule = await pool.query(
            "SELECT * FROM modules WHERE id = $1",
            [module_id]
        );

        if (checkModule.rowCount === 0) {
            return res.status(404).json({
                message: "No module found"
            });
        }

        // Check duplicate enrollment
        const checkEnrollment = await pool.query(
            `
            SELECT id
            FROM enrollment
            WHERE student_id = $1
              AND module_id = $2
              AND id != $3
            `,
            [student_id, module_id, id]
        );

        if (checkEnrollment.rowCount > 0) {
            return res.status(409).json({
                message: "This student is already enrolled in this module"
            });
        }

        // Build update query
        if (student_id) {
            queries.push(`student_id=$${values.length + 1}`);
            values.push(student_id);
        }

        if (module_id) {
            queries.push(`module_id=$${values.length + 1}`);
            values.push(module_id);
        }

        values.push(id);

        const result = await pool.query(
            `
            UPDATE enrollment
            SET ${queries.join(", ")}
            WHERE id=$${values.length}
            RETURNING *
            `,
            values
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No enrollment found"
            });
        }

        return res.status(200).json({
            message: "Enrollment updated",
            enrollment: result.rows[0]
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function deleteEnrollment(req,res){
       try{
             const id=Number(req.params.id);
             if(isNaN(id)){
                  return res.status(400).json({message:"Invalid enrollment id"});
             }
             const result=await pool.query('delete from enrollment where id=$1 returning *',[id]);
             if(result.rowCount===0){
                  return res.status(404).json({message:"No enrollment found"});
             }
             return res.status(200).json({message:"Enrollment deleted"});
       } 
       catch(err){
           console.log(err);
           return res.status(500).json({message:"Internal server error"});
       }
}


module.exports={
     createEnrollment,
     getEnrollment,
     getOneEnrollment,
     editEnrollment,
     deleteEnrollment
}