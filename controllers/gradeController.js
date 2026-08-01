const {pool}=require('../database/db');

async function createGrades(req, res) {
    try {
        const user_id = req.user.id;
        const user_role = req.user.role;

        const { student_id, module_id, grade } = req.body;

        if (!student_id || !module_id || grade === undefined) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const checkEnrollment = await pool.query(
            `
            SELECT 1
            FROM enrollments
            WHERE student_id = $1
            AND module_id = $2
            `,
            [student_id, module_id]
        );

        if (checkEnrollment.rowCount === 0) {
            return res.status(404).json({
                message: "Student is not enrolled in this module"
            });
        }

        let teacher_id = null;
        if (user_role === "Teacher") {

            const teacherProfile = await pool.query(
                `
                SELECT id
                FROM teacher_profiles
                WHERE user_id = $1
                `,
                [user_id]
            );

            if (teacherProfile.rowCount === 0) {
                return res.status(404).json({
                    message: "Teacher profile not found"
                });
            }

            teacher_id = teacherProfile.rows[0].id;

            const checkTeachingAssignment = await pool.query(
                `
                SELECT 1
                FROM teaching_assignments ta
                JOIN student_profiles sp
                    ON ta.class_id = sp.class_id
                WHERE ta.teacher_id = $1
                AND sp.id = $2
                AND ta.module_id = $3
                `,
                [teacher_id, student_id, module_id]
            );

            if (checkTeachingAssignment.rowCount === 0) {
                return res.status(403).json({
                    message: "You are not assigned to teach this student in this module"
                });
            }
        }

        const checkDuplicate = await pool.query(
            `
            SELECT 1
            FROM grades
            WHERE student_id = $1
            AND module_id = $2
            `,
            [student_id, module_id]
        );

        if (checkDuplicate.rowCount > 0) {
            return res.status(409).json({
                message: "Grade for this module already exists"
            });
        }

        const insert = await pool.query(
            `
            INSERT INTO grades
            (student_id, module_id, teacher_id, grade)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [student_id, module_id, teacher_id, grade]
        );

        return res.status(201).json({
            message: "Grade created successfully",
            grade: insert.rows[0]
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

        const result = await pool.query(
            `
            SELECT
                g.id AS grade_id,
                g.grade,
                m.id AS module_id,
                m.name AS module_name,
                m.semester,
                c.id AS class_id,
                c.name AS class_name,
                u.first_name AS student_first_name,
                u.last_name AS student_last_name
            FROM teaching_assignments ta
            JOIN teacher_profiles tp
                ON ta.teacher_id = tp.id
            JOIN grades g
                ON g.teacher_id = tp.id
                AND g.module_id = ta.module_id
            JOIN student_profiles sp
                ON g.student_id = sp.id
                AND sp.class_id = ta.class_id
            JOIN users u
                ON sp.user_id = u.id
            JOIN modules m
                ON ta.module_id = m.id
            JOIN classes c
                ON ta.class_id = c.id
            WHERE tp.user_id = $1
            ORDER BY
                c.name,
                m.name,
                u.last_name,
                u.first_name
            `,
            [user_id]
        );

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

module.exports={
     createGrades,
     getGrades,
     getMyGrades,
     getMyStudentsGrades
}