const {pool}=require('../database/db');

async function createTeachingAssignment(req, res) {
    try {
        const { teacher_id, module_id, class_id } = req.body;

        if (!teacher_id || !module_id || !class_id) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const checkTeacher = await pool.query(
            "SELECT * FROM teacher_profiles WHERE id=$1",
            [teacher_id]
        );

        if (checkTeacher.rowCount === 0) {
            return res.status(404).json({
                message: "No teacher found"
            });
        }

        const checkModule = await pool.query(
            "SELECT * FROM modules WHERE id=$1",
            [module_id]
        );

        if (checkModule.rowCount === 0) {
            return res.status(404).json({
                message: "No module found"
            });
        }

        const checkClass = await pool.query(
            "SELECT * FROM classes WHERE id=$1",
            [class_id]
        );

        if (checkClass.rowCount === 0) {
            return res.status(404).json({
                message: "No class found"
            });
        }

        const checkIfExists = await pool.query(
            `SELECT * FROM teaching_assignments
             WHERE module_id=$1
             AND teacher_id=$2
             AND class_id=$3`,
            [module_id, teacher_id, class_id]
        );

        if (checkIfExists.rowCount > 0) {
            return res.status(409).json({
                message: "Teaching Assignment already exists"
            });
        }

        const result = await pool.query(
            `INSERT INTO teaching_assignments
             ("teacher_id", "class_id", "module_id")
             VALUES ($1, $2, $3)
             RETURNING *`,
            [teacher_id, class_id, module_id]
        );

        return res.status(201).json({
            message: "Teaching assignment created",
            teaching_assignment: result.rows[0]
        });

    } catch (err) {
        console.log(err);

        if (err.code === "23503") {
            return res.status(400).json({
                message: "Invalid teacher, module, or class"
            });
        }

        if (err.code === "23505") {
            return res.status(409).json({
                message: "Teaching Assignment already exists"
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getTeachingAssignment(req, res) {
    try {
        const result = await pool.query(`
            SELECT
                ta.id AS teaching_assignment_id,
                ta.teacher_id,
                ta.module_id,
                ta.class_id,

                u.first_name AS teacher_name,
                u.last_name AS teacher_last_name,

                m.name AS module_name,
                c.name AS class_name

            FROM teaching_assignments ta

            JOIN modules m
                ON ta.module_id = m.id

            JOIN classes c
                ON ta.class_id = c.id

            JOIN teacher_profiles tp
                ON ta.teacher_id = tp.id

            JOIN users u
                ON u.id = tp.user_id
        `);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No teaching assignment found"
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
async function getOneTeachingAssignment(req,res){
      try{
          const id=Number(req.params.id);
          if(isNaN(id)){
              return res.status(400).json({message:"Invalid teaching assignment id"});
          }
          const result=await pool.query(`select u.first_name as teacher_name,m.name as module_name
                ,c.name as class_name,ta.id as teaching_assignment_id from teaching_assignments ta join modules m on ta.module_id=m.id join classes c on ta.class_id=c.id
                  join teacher_profiles tp on ta.teacher_id=tp.id join users u on u.id=tp.user_id
             where ta.id=$1`,[id]);

         if(result.rowCount===0){
              return res.status(404).json({message:"No teaching assignment found"});
         }
         return res.status(200).json({
              teaching_assignment:result.rows[0]
         })
         
      }
      catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}
async function getMyTeacherAssignment(req, res) {
    try {
        const user_id = req.user.id;

        const student = await pool.query(
            `
            SELECT class_id
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

        const class_id = student.rows[0].class_id;

        const result = await pool.query(
            `
            SELECT
                u.id AS teacher_id,
                u.first_name,
                u.last_name,
                m.id AS module_id,
                m.name AS module_name,
                c.id AS class_id,
                c.name AS class_name
            FROM teaching_assignments ta
            JOIN teacher_profiles tp
                ON ta.teacher_id = tp.id
            JOIN users u
                ON tp.user_id = u.id
            JOIN modules m
                ON ta.module_id = m.id
            JOIN classes c
                ON ta.class_id = c.id
            WHERE ta.class_id = $1
            ORDER BY m.name
            `,
            [class_id]
        );

        return res.status(200).json({
            message: "Teachers retrieved successfully",
            teachers: result.rows
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getMyTeachingAssignment(req, res) {
    try {
        const user_id = req.user.id;

        const result = await pool.query(
            `
            SELECT
                ta.id AS teaching_assignment_id,
                m.id AS module_id,
                m.name AS module_name,
                m.semester,
                c.id AS class_id,
                c.name AS class_name,
                d.id AS department_id,
                d.name AS department_name
            FROM teacher_profiles tp
            JOIN teaching_assignments ta
                ON tp.id = ta.teacher_id
            JOIN modules m
                ON ta.module_id = m.id
            JOIN classes c
                ON ta.class_id = c.id
            JOIN departments d
                ON c.department_id = d.id
            WHERE tp.user_id = $1
            ORDER BY d.name, c.name, m.name
            `,
            [user_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No teaching assignments found"
            });
        }

        return res.status(200).json({
            message: "Your teaching assignments",
            teaching_assignments: result.rows
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function getMyStudents(req, res) {
    try {
        const user_id = req.user.id;

        const result = await pool.query(
            `
            SELECT DISTINCT
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                sp.student_number,
                c.id AS class_id,
                c.name AS class_name,
                d.id AS department_id,
                d.name AS department_name
            FROM teacher_profiles tp
            JOIN teaching_assignments ta
                ON tp.id = ta.teacher_id
            JOIN classes c
                ON ta.class_id = c.id
            JOIN departments d
                ON c.department_id = d.id
            JOIN student_profiles sp
                ON c.id = sp.class_id
            JOIN users u
                ON sp.user_id = u.id
            WHERE tp.user_id = $1
            ORDER BY
                d.name,
                c.name,
                u.last_name,
                u.first_name
            `,
            [user_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No students found"
            });
        }

        return res.status(200).json({
            message: "Students retrieved successfully",
            students: result.rows
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function editTeachingAssignment(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid teaching assignment id"
            });
        }

        const { teacher_id, module_id, class_id } = req.body;

        const assignment = await pool.query(
            'SELECT * FROM teaching_assignments WHERE id=$1',
            [id]
        );

        if (assignment.rowCount === 0) {
            return res.status(404).json({
                message: "Teaching assignment not found"
            });
        }

        const current = assignment.rows[0];

        const newTeacher = teacher_id ?? current.teacher_id;
        const newModule = module_id ?? current.module_id;
        const newClass = class_id ?? current.class_id;

        const checkDuplicate = await pool.query(
            `
            SELECT id
            FROM teaching_assignments
            WHERE teacher_id = $1
              AND module_id = $2
              AND class_id = $3
              AND id <> $4
            `,
            [newTeacher, newModule, newClass, id]
        );

        if (checkDuplicate.rowCount > 0) {
            return res.status(409).json({
                message: "This teaching assignment already exists"
            });
        }


        if (teacher_id) {
            const teacher = await pool.query(
                'SELECT id FROM teacher_profiles WHERE id=$1',
                [teacher_id]
            );

            if (teacher.rowCount === 0) {
                return res.status(404).json({
                    message: "Teacher not found"
                });
            }
        }

        if (module_id) {
            const module = await pool.query(
                'SELECT id FROM modules WHERE id=$1',
                [module_id]
            );

            if (module.rowCount === 0) {
                return res.status(404).json({
                    message: "Module not found"
                });
            }
        }

        if (class_id) {
            const classroom = await pool.query(
                'SELECT id FROM classes WHERE id=$1',
                [class_id]
            );

            if (classroom.rowCount === 0) {
                return res.status(404).json({
                    message: "Class not found"
                });
            }
        }

        const queries = [];
        const values = [];

        if (teacher_id) {
            queries.push(`teacher_id=$${values.length + 1}`);
            values.push(teacher_id);
        }

        if (module_id) {
            queries.push(`module_id=$${values.length + 1}`);
            values.push(module_id);
        }

        if (class_id) {
            queries.push(`class_id=$${values.length + 1}`);
            values.push(class_id);
        }

        if (queries.length === 0) {
            return res.status(400).json({
                message: "No fields to edit"
            });
        }

        values.push(id);

        const update = await pool.query(
            `UPDATE teaching_assignments
             SET ${queries.join(', ')}
             WHERE id=$${values.length}
             RETURNING *`,
            values
        );

        return res.status(200).json({
            message: "Teaching assignment updated",
            teaching_assignment: update.rows[0]
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function deleteTeachingAssignment(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid teaching assignment id"
            });
        }

        const result = await pool.query(
            "DELETE FROM teaching_assignments WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Teaching assignment not found"
            });
        }

        return res.status(200).json({
            message: "Teaching assignment deleted successfully"
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
module.exports={
     createTeachingAssignment,
     getTeachingAssignment,
     getOneTeachingAssignment,
     getMyTeacherAssignment,
     getMyTeachingAssignment,
     getMyStudents,
     editTeachingAssignment,
     deleteTeachingAssignment


}