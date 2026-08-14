const {pool}=require('../database/db');

async function createGrades(req, res) {
    try {
        const user_id = req.user.id;
        const role = req.user.role;

        const { student_id, module_id, grade } = req.body;

        if (!student_id || !module_id || grade === undefined) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const enrollment = await pool.query(`
            SELECT 1
            FROM enrollment
            WHERE student_id = $1
            AND module_id = $2
        `, [student_id, module_id]);

        if (enrollment.rowCount === 0) {
            return res.status(404).json({
                message: "Student is not enrolled in this module"
            });
        }

        let teacher_id = null;

        // If teacher, check that he teaches this student's class + module
        if (role === "Teacher") {

            const teacher = await pool.query(`
                SELECT tp.id
                FROM teacher_profiles tp
                JOIN teaching_assignments ta
                    ON ta.teacher_id = tp.id
                JOIN student_profiles sp
                    ON sp.class_id = ta.class_id
                WHERE tp.user_id = $1
                AND sp.id = $2
                AND ta.module_id = $3
            `, [user_id, student_id, module_id]);

            if (teacher.rowCount === 0) {
                return res.status(403).json({
                    message: "You are not assigned to teach this student in this module"
                });
            }

            teacher_id = teacher.rows[0].id;
        }

        // Check duplicate
        const duplicate = await pool.query(`
            SELECT 1
            FROM grades
            WHERE student_id = $1
            AND module_id = $2
        `, [student_id, module_id]);

        if (duplicate.rowCount > 0) {
            return res.status(409).json({
                message: "Grade for this module already exists"
            });
        }

        const result = await pool.query(`
            INSERT INTO grades
            (student_id, module_id, teacher_id, grade)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [student_id, module_id, teacher_id, grade]);

        return res.status(201).json({
            message: "Grade created successfully",
            grade: result.rows[0]
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function getGrades(req, res) {
    try {

        const result = await pool.query(`
            SELECT
                g.id AS grade_id,
                g.grade,
                u.first_name,
                u.last_name,
                m.id AS module_id,
                m.name AS module_name,
                m.semester,
                c.id AS class_id,
                c.name AS class_name
            FROM grades g
            JOIN student_profiles sp
                ON g.student_id = sp.id
            JOIN users u
                ON sp.user_id = u.id
            JOIN modules m
                ON g.module_id = m.id
            JOIN classes c
                ON sp.class_id = c.id
            ORDER BY
                c.name,
                m.name,
                u.last_name,
                u.first_name
        `);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No grades found"
            });
        }

        return res.status(200).json({
            message: "Grades retrieved successfully",
            grades: result.rows
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function getMyGrades(req,res){
      try{
         const user_id=req.user.id;
         const query=await pool.query(`
             SELECT
                g.id AS grade_id,
                g.grade,
                u.first_name,
                u.last_name,
                m.id AS module_id,
                m.name AS module_name,
                m.semester,
                c.id AS class_id,
                c.name AS class_name
            FROM grades g
            JOIN student_profiles sp
                ON g.student_id = sp.id
            JOIN users u
                ON sp.user_id = u.id
            JOIN modules m
                ON g.module_id = m.id
            JOIN classes c
                ON sp.class_id = c.id
            WHERE sp.user_id=$1
            ORDER BY
                c.name,
                m.name,
                u.last_name,
                u.first_name
        `
        ,[user_id] );
        
        if(query.rowCount===0){
             return res.status(404).json({message:"Cannot get ur grades"});
        }
        return res.status(200).json({message:"Grades retrieved",grades:query.rows});
         
         
      }
      catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}
async function getMyStudentsGrades(req, res) {
    try {
        const user_id = req.user.id;

        const result = await pool.query(`
            SELECT
                sp.id AS student_id,

                u.first_name AS student_first_name,
                u.last_name AS student_last_name,

                m.id AS module_id,
                m.name AS module_name,
                m.semester,

                c.id AS class_id,
                c.name AS class_name,

                g.id AS grade_id,
                g.grade

            FROM teaching_assignments ta

            JOIN teacher_profiles tp
                ON ta.teacher_id = tp.id

            JOIN classes c
                ON ta.class_id = c.id

            JOIN student_profiles sp
                ON sp.class_id = c.id

            JOIN users u
                ON sp.user_id = u.id

            JOIN modules m
                ON ta.module_id = m.id

            LEFT JOIN grades g
                ON g.student_id = sp.id
                AND g.module_id = ta.module_id

            WHERE tp.user_id = $1

            ORDER BY
                c.name,
                m.name,
                u.last_name,
                u.first_name
        `, [user_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No students found"
            });
        }

        return res.status(200).json({
            message: "Students grades retrieved successfully",
            grades: result.rows
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function getOneStudentGrades(req, res) {
    try {
        const user_id = req.user.id;
        const role = req.user.role;
        const student_id = Number(req.params.id);

        if (isNaN(student_id)) {
            return res.status(400).json({
                message: "Invalid student id"
            });
        }

        let result;

        if (role === "Admin") {

            result = await pool.query(`
                SELECT
                    g.id AS grade_id,
                    g.grade,
                    m.id AS module_id,
                    m.name AS module_name,
                    m.semester,

                    sp.id AS student_id,
                    u.first_name AS student_first_name,
                    u.last_name AS student_last_name,

                    c.id AS class_id,
                    c.name AS class_name

                FROM grades g

                JOIN modules m
                    ON g.module_id = m.id

                JOIN student_profiles sp
                    ON g.student_id = sp.id

                JOIN users u
                    ON sp.user_id = u.id

                JOIN classes c
                    ON sp.class_id = c.id

                WHERE g.student_id = $1

                ORDER BY m.name
            `, [student_id]);

        } else if (role === "Teacher") {

            result = await pool.query(`
                SELECT
                    g.id AS grade_id,
                    g.grade,

                    m.id AS module_id,
                    m.name AS module_name,
                    m.semester,

                    sp.id AS student_id,
                    u.first_name AS student_first_name,
                    u.last_name AS student_last_name,

                    c.id AS class_id,
                    c.name AS class_name

                FROM teaching_assignments ta

                JOIN teacher_profiles tp
                    ON ta.teacher_id = tp.id

                JOIN student_profiles sp
                    ON sp.class_id = ta.class_id

                JOIN grades g
                    ON g.student_id = sp.id
                    AND g.module_id = ta.module_id

                JOIN modules m
                    ON g.module_id = m.id

                JOIN classes c
                    ON sp.class_id = c.id

                JOIN users u
                    ON sp.user_id = u.id

                WHERE tp.user_id = $1
                AND sp.id = $2

                ORDER BY m.name
            `, [user_id, student_id]);

        } else {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No grades found for this student"
            });
        }

        return res.status(200).json({
            message: "Student grades retrieved",
            grades: result.rows
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function editStudentGrades(req, res) {
    try {
        const role = req.user.role;
        const user_id = req.user.id;

        const id = Number(req.params.id); 

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid grade id"
            });
        }

        const { grade } = req.body;

        if (grade === undefined) {
            return res.status(400).json({
                message: "Grade is required"
            });
        }

        if (role === "Admin") {

            const update = await pool.query(
                `
                UPDATE grades
                SET grade = $1
                WHERE id = $2
                RETURNING *
                `,
                [grade, id]
            );

            if (update.rowCount === 0) {
                return res.status(404).json({
                    message: "Grade not found"
                });
            }

            return res.status(200).json({
                message: "Grade updated successfully",
                grade: update.rows[0]
            });
        }

        if (role === "Teacher") {

            const checkTeacher = await pool.query(
                `
                SELECT g.id
                FROM grades g
                JOIN student_profiles sp
                    ON g.student_id = sp.id
                JOIN teaching_assignments ta
                    ON ta.class_id = sp.class_id
                    AND ta.module_id = g.module_id
                JOIN teacher_profiles tp
                    ON ta.teacher_id = tp.id
                WHERE tp.user_id = $1
                AND g.id = $2
                `,
                [user_id, id]
            );

            if (checkTeacher.rowCount === 0) {
                return res.status(403).json({
                    message: "You are not assigned to this student's class or module"
                });
            }

            const update = await pool.query(
                `
                UPDATE grades
                SET grade = $1
                WHERE id = $2
                RETURNING *
                `,
                [grade, id]
            );

            return res.status(200).json({
                message: "Grade updated successfully",
                grade: update.rows[0]
            });
        }

        return res.status(403).json({
            message: "Forbidden"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function deleteGrade(req,res){
      try{
          const id=Number(req.params.id);
          if(isNaN(id)){
              return res.status(400).json({message:"Invalid grade id"});
          }
          
         const result=await pool.query(`Delete from grades where id=$1 returning *`,[id]);
         if(result.rowCount===0){
              return res.status(404).json({message:"No grade found"})
         }
         return res.status(200).json({message:"Grade deleted"});
      }
      catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}
    
module.exports={
     createGrades,
     getGrades,
     getMyGrades,
     getMyStudentsGrades,
     getOneStudentGrades,
     editStudentGrades,
     deleteGrade
}