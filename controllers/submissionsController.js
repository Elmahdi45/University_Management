const { create } = require('axios');
const {pool}=require('../database/db');

async function createSubmission(req, res) {
    try {
        const user_id = req.user.id;
        const { assignment_id, file_path } = req.body;

        if (!assignment_id || !file_path) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const checkAssignment = await pool.query(
            `
            SELECT
                sp.id AS student_id,
                a.id AS assignment_id
            FROM student_profiles sp

            JOIN classes c
                ON sp.class_id = c.id

            JOIN teaching_assignments ta
                ON ta.class_id = c.id

            JOIN assignments a
                ON a.module_id = ta.module_id
               AND a.teacher_id = ta.teacher_id

            WHERE sp.user_id = $1
              AND a.id = $2
            `,
            [user_id, assignment_id]
        );

        if (checkAssignment.rowCount === 0) {
            return res.status(403).json({
                message: "You are not allowed to submit this assignment"
            });
        }

        const student_id = checkAssignment.rows[0].student_id;

        const alreadySubmitted = await pool.query(
            `
            SELECT *
            FROM submissions
            WHERE assignment_id = $1
              AND student_id = $2
            `,
            [assignment_id, student_id]
        );

        if (alreadySubmitted.rowCount > 0) {
            return res.status(409).json({
                message: "You have already submitted this assignment"
            });
        }

        const insert = await pool.query(
            `
            INSERT INTO submissions
                (assignment_id, student_id, file_path)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [assignment_id, student_id, file_path]
        );

        return res.status(201).json({
            message: "Submission created successfully",
            submission: insert.rows[0]
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function getMyStudentsSubmissions(req, res) {
    try {
        const user_id = req.user.id;

        const result = await pool.query(`
            SELECT
                s.id AS submission_id,
                s.file_path AS submission_file_path,
                s.grade,

                a.id AS assignment_id,
                a.title AS assignment_title,
                a.description AS assignment_description,
                a.deadline,

                m.id AS module_id,
                m.name AS module_name,
                m.semester,

                c.id AS class_id,
                c.name AS class_name,

                sp.id AS student_profile_id,

                u.first_name AS student_first_name,
                u.last_name AS student_last_name

            FROM submissions s

            JOIN assignments a
                ON s.assignment_id = a.id

            JOIN modules m
                ON a.module_id = m.id

            JOIN teacher_profiles tp
                ON a.teacher_id = tp.id

            JOIN teaching_assignments ta
                ON ta.teacher_id = tp.id
               AND ta.module_id = a.module_id

            JOIN classes c
                ON ta.class_id = c.id

            JOIN student_profiles sp
                ON sp.id = s.student_id

            JOIN users u
                ON sp.user_id = u.id

            WHERE tp.user_id = $1

            ORDER BY a.deadline ASC
        `, [user_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No submissions found"
            });
        }

        return res.status(200).json({
            message: "Submissions retrieved",
            submissions: result.rows
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function getMySubmissions(req,res){
       try{
             const user_id=req.user.id;
             const result=await pool.query(`
                SELECT
                s.id AS submission_id,
                s.file_path AS submission_file_path,
                s.grade,

                a.id AS assignment_id,
                a.title AS assignment_title,
                a.description AS assignment_description,
                a.deadline,

                m.id AS module_id,
                m.name AS module_name,
                m.semester,

                c.id AS class_id,
                c.name AS class_name,

                sp.id AS student_profile_id,

                u.first_name AS student_first_name,
                u.last_name AS student_last_name

                        FROM submissions s

                        JOIN assignments a
                            ON s.assignment_id = a.id

                        JOIN modules m
                            ON a.module_id = m.id

                        JOIN teacher_profiles tp
                            ON a.teacher_id = tp.id

                        JOIN teaching_assignments ta
                            ON ta.teacher_id = tp.id
                        AND ta.module_id = a.module_id

                        JOIN classes c
                            ON ta.class_id = c.id

                        JOIN student_profiles sp
                            ON sp.id = s.student_id

                        JOIN users u
                            ON sp.user_id = u.id

                        WHERE sp.user_id = $1

                        ORDER BY a.deadline ASC         
                
                
            `,[user_id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No submissions found"
            });
        }

         return res.status(200).json({
            message: "Submissions retrieved",
            submissions: result.rows
        });


       }
       catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
       }
}

async function getOneSubmission(req,res){
      try{
           const user_id=req.user.id;
           const role=req.user.role;
           
           const id=Number(req.params.id);
           if(isNaN(id)){
               return res.status(400).json({message:"Invalid submission id"});
           }
           let result;

           if(role==="Admin"){
                result=await pool.query('select * from submissions where id=$1',[id]);
           }
           else if(role==="Teacher"){
               result=await pool.query(`
                        SELECT
                s.id AS submission_id,
                s.file_path AS submission_file_path,
                s.grade,

                a.id AS assignment_id,
                a.title AS assignment_title,
                a.description AS assignment_description,
                a.deadline,

                m.id AS module_id,
                m.name AS module_name,
                m.semester,

                c.id AS class_id,
                c.name AS class_name,

                sp.id AS student_profile_id,

                u.first_name AS student_first_name,
                u.last_name AS student_last_name

                        FROM submissions s

                        JOIN assignments a
                            ON s.assignment_id = a.id

                        JOIN modules m
                            ON a.module_id = m.id

                        JOIN teacher_profiles tp
                            ON a.teacher_id = tp.id

                        JOIN teaching_assignments ta
                            ON ta.teacher_id = tp.id
                        AND ta.module_id = a.module_id

                        JOIN classes c
                            ON ta.class_id = c.id

                        JOIN student_profiles sp
                            ON sp.id = s.student_id

                        JOIN users u
                            ON sp.user_id = u.id

                        WHERE tp.user_id = $1
                        AND s.id=$2
                        ORDER BY a.deadline ASC

                `,[user_id,id]);
           }
           else if(role==="Student"){
                 result=await pool.query(`
                                  SELECT
                        s.id AS submission_id,
                        s.file_path AS submission_file_path,
                        s.grade,

                        a.id AS assignment_id,
                        a.title AS assignment_title,
                        a.description AS assignment_description,
                        a.deadline,

                        m.id AS module_id,
                        m.name AS module_name,
                        m.semester,

                        c.id AS class_id,
                        c.name AS class_name,

                        sp.id AS student_profile_id,

                        u.first_name AS student_first_name,
                        u.last_name AS student_last_name

                                FROM submissions s

                                JOIN assignments a
                                    ON s.assignment_id = a.id

                                JOIN modules m
                                    ON a.module_id = m.id

                                JOIN teacher_profiles tp
                                    ON a.teacher_id = tp.id

                                JOIN teaching_assignments ta
                                    ON ta.teacher_id = tp.id
                                AND ta.module_id = a.module_id

                                JOIN classes c
                                    ON ta.class_id = c.id

                                JOIN student_profiles sp
                                    ON sp.id = s.student_id

                                JOIN users u
                                    ON sp.user_id = u.id

                                WHERE sp.user_id = $1
                                AND s.id=$2

                                ORDER BY a.deadline ASC    
                    `,[user_id,id]);
           }

           if(result.rowCount===0){
              return res.status(404).json({message:"No submission found"});
           }
           return res.status(200).json({
             message:"Submission retrieved",
             submission:result.rows[0]
           });
      }
      catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}

async function editSubmission(req, res) {
    try {
        const user_id = req.user.id;
        const id = Number(req.params.id);
        const { file_path } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid submission id"
            });
        }

        if (!file_path) {
            return res.status(400).json({
                message: "No fields to update"
            });
        }

        const checkSubmission = await pool.query(
            `
            SELECT s.id
            FROM submissions s
            JOIN student_profiles sp
                ON s.student_id = sp.id
            JOIN assignments a
                ON s.assignment_id = a.id
            WHERE s.id = $1
              AND sp.user_id = $2
              AND NOW() <= a.deadline
            `,
            [id, user_id]
        );

        if (checkSubmission.rowCount === 0) {
            return res.status(403).json({
                message: "You cannot edit this submission or the deadline has passed"
            });
        }

        const update = await pool.query(
            `
            UPDATE submissions
            SET file_path = $1
            WHERE id = $2
            RETURNING *
            `,
            [file_path, id]
        );

        return res.status(200).json({
            message: "Submission updated",
            submission: update.rows[0]
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function deleteSubmission(req, res) {
    try {
        const user_id = req.user.id;
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid submission id"
            });
        }

        const result = await pool.query(
            `
            DELETE FROM submissions
            WHERE id = $1
            AND student_id = (
                SELECT id
                FROM student_profiles
                WHERE user_id = $2
            )
            RETURNING *
            `,
            [id, user_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Submission not found"
            });
        }

        return res.status(200).json({
            message: "Submission deleted"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function gradeSubmission(req, res) {
    try {
        const user_id = req.user.id;
        const id = Number(req.params.id);
        const { grade } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid submission id"
            });
        }

        if (grade === undefined) {
            return res.status(400).json({
                message: "Grade is required"
            });
        }

        if (grade < 0 || grade > 20) {
            return res.status(400).json({
                message: "Grade must be between 0 and 20"
            });
        }

        const checkTeacher = await pool.query(
            `
            SELECT s.id
            FROM submissions s

            JOIN assignments a
                ON s.assignment_id = a.id

            JOIN teacher_profiles tp
                ON a.teacher_id = tp.id

            WHERE tp.user_id = $1
            AND s.id = $2
            `,
            [user_id, id]
        );

        if (checkTeacher.rowCount === 0) {
            return res.status(403).json({
                message: "You are not allowed to grade this submission"
            });
        }

        const result = await pool.query(
            `
            UPDATE submissions
            SET grade = $1
            WHERE id = $2
            RETURNING *
            `,
            [grade, id]
        );

        return res.status(200).json({
            message: "Submission graded successfully",
            submission: result.rows[0]
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports={
     createSubmission,
     getMyStudentsSubmissions,
     getMySubmissions,
     getOneSubmission,
     editSubmission,
     deleteSubmission,
     gradeSubmission
}