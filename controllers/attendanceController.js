const {pool}=require('../database/db');

async function createAttendance(req,res){
  try{

     const role=req.user.role;
     const user_id=req.user.id;
          const {student_id,module_id,date,status}=req.body;
            if(!student_id || !module_id || !date || !status){
                 return res.status(400).json({message:"All fields are required"});
            }
          const checkIfStudentExists=await pool.query('select * from student_profiles where id=$1',[student_id]);
          if(checkIfStudentExists.rowCount===0){
              return res.status(404).json({message:"No student found"});
          }
          const get_student_class_id=checkIfStudentExists.rows[0].class_id;
          const checkIfModuleExists=await pool.query('select * from modules where id=$1',[module_id]);
          if(checkIfModuleExists.rowCount===0){
              return res.status(404).json({message:"No module found"});
          }


          const checkEnrollment=await pool.query('select * from enrollment where student_id=$1 and module_id=$2',[student_id,module_id]);
          if(checkEnrollment.rowCount===0){
              return res.status(400).json({message:"Student is not enrolled"});
          }

       
        if(role==="Teacher"){
             const teachingAssignment=await pool.query(`select ta.id from teaching_assignments ta join
             teacher_profiles tp on ta.teacher_id=tp.id where tp.user_id=$1 and ta.class_id=$2 and ta.module_id=$3`,[user_id,get_student_class_id,module_id]);      
             
             if(teachingAssignment.rowCount===0){
                  return res.status(403).json({message:"You are not assigned to teach this module and class"});
             }

        }

        const checkAttendance=await pool.query('select * from attendance where class_id=$1 and module_id=$2 and date=$3',[class_id,module_id,date]);
        if(checkAttendance.rowCount>0){
              return res.status(409).json({message:"Attendance already recorded for this student today"});
        }

          const insert=await pool.query('Insert into attendance("student_id","module_id","date","status") values($1,$2,$3,$4) returning *',[student_id,module_id,date,status]);
                if(insert.rowCount===0){
                    return res.status(404).json({message:"no attendance found"});
                }
                return res.status(201).json({
                    message:"Attendance created",
                    attendance:insert.rows[0]
        })
    }
    catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
    }
}

async function getAttendance(req, res) {
    try {
        const user_id = req.user.id;
        const role = req.user.role;

        let result;

        if (role === "Admin") {

            result = await pool.query(`
                SELECT *
                FROM attendance
                ORDER BY date DESC
            `);

        } else if (role === "Teacher") {

            result = await pool.query(`
                SELECT
                    a.*,
                    u.first_name,
                    u.last_name,
                    m.name AS module_name,
                    c.name AS class_name
                FROM attendance a
                JOIN student_profiles sp
                    ON a.student_id = sp.id
                JOIN users u
                    ON sp.user_id = u.id
                JOIN modules m
                    ON a.module_id = m.id
                JOIN teaching_assignments ta
                    ON ta.class_id = sp.class_id
                    AND ta.module_id = a.module_id
                JOIN teacher_profiles tp
                    ON ta.teacher_id = tp.id
                JOIN classes c
                    ON sp.class_id = c.id
                WHERE tp.user_id = $1
                ORDER BY a.date DESC
            `, [user_id]);

        } else {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No attendance found"
            });
        }

        return res.status(200).json({
            message: "Attendance retrieved successfully",
            attendance: result.rows
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getAttendanceByClassAndModule(req, res) {
    try {
        const user_id = req.user.id;
        const role = req.user.role;

        const class_id = Number(req.params.class_id);
        const module_id = Number(req.params.module_id);

        if (isNaN(class_id)) {
            return res.status(400).json({
                message: "Invalid class id"
            });
        }

        if (isNaN(module_id)) {
            return res.status(400).json({
                message: "Invalid module id"
            });
        }

        let result;

        if (role === "Admin") {

            result = await pool.query(
                `
                SELECT
                    a.id,
                    a.date,
                    a.status,
                    u.first_name,
                    u.last_name,
                    m.name AS module_name,
                    c.name AS class_name
                FROM attendance a
                JOIN student_profiles sp
                    ON a.student_id = sp.id
                JOIN users u
                    ON sp.user_id = u.id
                JOIN modules m
                    ON a.module_id = m.id
                JOIN classes c
                    ON sp.class_id = c.id
                WHERE c.id = $1
                  AND a.module_id = $2
                ORDER BY a.date DESC
                `,
                [class_id, module_id]
            );

        } else if (role === "Teacher") {

            result = await pool.query(
                `
                SELECT
                    a.id,
                    a.date,
                    a.status,
                    u.first_name,
                    u.last_name,
                    m.name AS module_name,
                    c.name AS class_name
                FROM attendance a
                JOIN student_profiles sp
                    ON a.student_id = sp.id
                JOIN users u
                    ON sp.user_id = u.id
                JOIN modules m
                    ON a.module_id = m.id
                JOIN classes c
                    ON sp.class_id = c.id
                JOIN teaching_assignments ta
                    ON ta.class_id = c.id
                   AND ta.module_id = a.module_id
                JOIN teacher_profiles tp
                    ON ta.teacher_id = tp.id
                WHERE tp.user_id = $1
                  AND c.id = $2
                  AND a.module_id = $3
                ORDER BY a.date DESC
                `,
                [user_id, class_id, module_id]
            );

        } else {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No attendance found"
            });
        }

        return res.status(200).json({
            message: "Attendance retrieved successfully",
            attendance: result.rows
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function getMyAttendance(req, res) {
    try {
        const user_id = req.user.id;
        const student = await pool.query(
            `
            SELECT id
            FROM student_profiles
            WHERE user_id = $1
            `,
            [user_id]
        );

        if (student.rowCount === 0) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        const student_id = student.rows[0].id;

        const result = await pool.query(
            `
            SELECT
                a.id,
                a.date,
                a.status,
                m.id AS module_id,
                m.name AS module_name
            FROM attendance a
            JOIN modules m
                ON a.module_id = m.id
            WHERE a.student_id = $1
            ORDER BY a.date DESC
            `,
            [student_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No attendance found"
            });
        }

        return res.status(200).json({
            message: "Your attendance retrieved successfully",
            attendance: result.rows
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function editAttendance(req, res) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid attendance id"
            });
        }
        const checkAttendance = await pool.query(
            "SELECT * FROM attendance WHERE id = $1",
            [id]
        );
        if (checkAttendance.rowCount === 0) {
            return res.status(404).json({
                message: "Attendance not found"
            });
        }
        const {module_id,date,status}=req.body;
        const queries=[];
        const values=[];
        if (module_id) {

            const checkModule=await pool.query(
                "SELECT id FROM modules WHERE id = $1",
                [module_id]
            );

            if (checkModule.rowCount === 0) {
                return res.status(404).json({
                    message: "Module not found"
                });
            }

            queries.push(`module_id=$${values.length + 1}`);
            values.push(module_id);
        }

        if(date){
            queries.push(`date = $${values.length + 1}`);
            values.push(date);
        }

        if (status) {
            queries.push(`status = $${values.length + 1}`);
            values.push(status);
        }

        if (queries.length === 0) {
            return res.status(400).json({
                message: "No fields to edit"
            });
        }

        values.push(id);
        const update = await pool.query(
            `
            UPDATE attendance
            SET ${queries.join(", ")}
            WHERE id = $${values.length}
            RETURNING *
            `,
            values
        );

        return res.status(200).json({
            message: "Attendance updated successfully",
            attendance: update.rows[0]
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function deleteAttendance(req,res){
      try{
          const id=Number(req.params.id);
          if(isNaN(id)){
              return res.status(400).json({message:"Invalid attendance id"});
          }
          const checkAttendance=await pool.query('select * from attendance where id=$1',[id]);
          if(checkAttendance.rowCount===0){
              return res.status(404).json({message:"Attendance not found"});
          }
          
          await pool.query('delete from attendance where id=$1',[id]);
          return res.status(200).json({message:"Attendance deleted"});
      }
      catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}


module.exports={
      createAttendance,
      getAttendance,
      getAttendanceByClassAndModule,
      getMyAttendance,
      editAttendance,
      deleteAttendance
}