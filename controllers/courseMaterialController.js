const {pool}=require('../database/db');

async function createCourseMaterial(req, res) {
    try {
        const user_id = req.user.id;
        const { module_id, title, file_path } = req.body;

        if (!module_id || !title || !file_path) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const checkTeacher = await pool.query(
            `
            SELECT ta.teacher_id
            FROM teaching_assignments ta
            JOIN teacher_profiles tp
                ON ta.teacher_id = tp.id
            WHERE tp.user_id = $1
            AND ta.module_id = $2
            `,
            [user_id, module_id]
        );

        if (checkTeacher.rowCount === 0) {
            return res.status(403).json({
                message: "You are not assigned to teach this module",
            });
        }

        const teacher_id = checkTeacher.rows[0].teacher_id;

        const checkIfExists = await pool.query(
            `
            SELECT *
            FROM course_materials
            WHERE module_id = $1
            AND teacher_id = $2
            AND title = $3
            `,
            [module_id, teacher_id, title]
        );

        if (checkIfExists.rowCount > 0) {
            return res
                .status(409)
                .json({ message: "Course material already exists" });
        }

        const insert = await pool.query(
            `
            INSERT INTO course_materials
            (module_id, teacher_id, title, file_path)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [module_id, teacher_id, title, file_path]
        );

        return res.status(201).json({
            message: "Course material created!",
            courseMaterial: insert.rows[0],
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
async function getCourseMaterial(req, res) {
    try {
        const user_id = req.user.id;
        const role = req.user.role;

        let result;

        if (role === "Admin") {
            result = await pool.query(`
                SELECT
                    cm.id,
                    cm.title,
                    cm.file_path,
                    cm.uploaded_at,

                    m.id AS module_id,
                    m.name AS module_name,
                    m.semester AS module_semester,

                    u.first_name AS teacher_first_name,
                    u.last_name AS teacher_last_name

                FROM course_materials cm

                JOIN modules m
                    ON cm.module_id = m.id

                JOIN teacher_profiles tp
                    ON cm.teacher_id = tp.id

                JOIN users u
                    ON tp.user_id = u.id

                ORDER BY cm.uploaded_at DESC
            `);
        }

        else if (role === "Teacher") {

            result = await pool.query(`
                SELECT
                    cm.id,
                    cm.title,
                    cm.file_path,
                    cm.uploaded_at,

                    m.id AS module_id,
                    m.name AS module_name,
                    m.semester AS module_semester,

                    u.first_name AS teacher_first_name,
                    u.last_name AS teacher_last_name

                FROM course_materials cm

                JOIN modules m
                    ON cm.module_id = m.id

                JOIN teacher_profiles tp
                    ON cm.teacher_id = tp.id

                JOIN users u
                    ON tp.user_id = u.id

                WHERE tp.user_id = $1

                ORDER BY cm.uploaded_at DESC
            `, [user_id]);
        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No course materials found"
            });
        }

        return res.status(200).json({
            message: "Course materials retrieved",
            courseMaterials: result.rows
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getMyCourseMaterials(req, res) {
    try {
        const user_id = req.user.id;

        const result = await pool.query(`
            SELECT
                cm.id,
                cm.title,
                cm.file_path,
                cm.uploaded_at,

                m.id AS module_id,
                m.name AS module_name,

                c.id AS class_id,
                c.name AS class_name,

                u.first_name AS teacher_first_name,
                u.last_name AS teacher_last_name

            FROM student_profiles sp

            JOIN classes c
                ON sp.class_id = c.id

            JOIN teaching_assignments ta
                ON ta.class_id = c.id

            JOIN course_materials cm
                ON cm.module_id = ta.module_id
               AND cm.teacher_id = ta.teacher_id

            JOIN modules m
                ON cm.module_id = m.id

            JOIN teacher_profiles tp
                ON cm.teacher_id = tp.id

            JOIN users u
                ON tp.user_id = u.id

            WHERE sp.user_id = $1

            ORDER BY cm.uploaded_at DESC
        `, [user_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No course materials found"
            });
        }

        return res.status(200).json({
            message: "Course materials retrieved",
            courseMaterials: result.rows
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function getOneCourseMaterial(req, res) {
    try {
        const user_id = req.user.id;
        const role = req.user.role;
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid course material id"
            });
        }

        let result;

        if (role === "Admin") {

            result = await pool.query(
                `SELECT * FROM course_materials WHERE id=$1`,
                [id]
            );

        } else if (role === "Teacher") {

            result = await pool.query(`
                SELECT
                    cm.id,
                    cm.title,
                    cm.file_path,
                    cm.uploaded_at,

                    m.id AS module_id,
                    m.name AS module_name,

                    c.id AS class_id,
                    c.name AS class_name,

                    u.first_name AS teacher_first_name,
                    u.last_name AS teacher_last_name

                FROM course_materials cm

                JOIN modules m
                    ON cm.module_id = m.id

                JOIN teacher_profiles tp
                    ON cm.teacher_id = tp.id

                JOIN users u
                    ON tp.user_id = u.id

                JOIN teaching_assignments ta
                    ON ta.teacher_id = tp.id
                   AND ta.module_id = cm.module_id

                JOIN classes c
                    ON ta.class_id = c.id

                WHERE tp.user_id=$1
                  AND cm.id=$2
            `, [user_id, id]);

        } else if (role === "Student") {

            result = await pool.query(`
                SELECT
                    cm.id,
                    cm.title,
                    cm.file_path,
                    cm.uploaded_at,

                    m.id AS module_id,
                    m.name AS module_name,

                    c.id AS class_id,
                    c.name AS class_name,

                    u.first_name AS teacher_first_name,
                    u.last_name AS teacher_last_name

                FROM student_profiles sp

                JOIN classes c
                    ON sp.class_id = c.id

                JOIN teaching_assignments ta
                    ON ta.class_id = c.id

                JOIN course_materials cm
                    ON cm.module_id = ta.module_id
                   AND cm.teacher_id = ta.teacher_id

                JOIN modules m
                    ON cm.module_id = m.id

                JOIN teacher_profiles tp
                    ON cm.teacher_id = tp.id

                JOIN users u
                    ON tp.user_id = u.id

                WHERE sp.user_id=$1
                  AND cm.id=$2
            `, [user_id, id]);

        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Course material not found"
            });
        }

        return res.status(200).json({
            message: "Course material retrieved",
            courseMaterial: result.rows[0]
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function editCourseMaterial(req, res) {
    try {
        const user_id = req.user.id;
        const role = req.user.role;
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid course material id"
            });
        }

        const { title, file_path } = req.body;

        const queries = [];
        const values = [];

        if (title) {
            queries.push(`title=$${values.length + 1}`);
            values.push(title);
        }

        if (file_path) {
            queries.push(`file_path=$${values.length + 1}`);
            values.push(file_path);
        }

        if (queries.length === 0) {
            return res.status(400).json({
                message: "No fields to update"
            });
        }

        values.push(id);

        let result;

        if (role === "Admin") {

            result = await pool.query(`
                UPDATE course_materials
                SET ${queries.join(", ")}
                WHERE id=$${values.length}
                RETURNING *
            `, values);

        } else if (role === "Teacher") {

            result = await pool.query(`
                UPDATE course_materials
                SET ${queries.join(", ")}
                WHERE id=$${values.length}
                  AND teacher_id = (
                        SELECT id
                        FROM teacher_profiles
                        WHERE user_id=$${values.length + 1}
                  )
                RETURNING *
            `, [...values, user_id]);

        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Course material not found"
            });
        }

        return res.status(200).json({
            message: "Course material updated",
            courseMaterial: result.rows[0]
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function deleteCourseMaterial(req, res) {
    try {
        const user_id = req.user.id;
        const role = req.user.role;
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid course material id"
            });
        }

        let result;

        if (role === "Admin") {

            result = await pool.query(
                `DELETE FROM course_materials
                 WHERE id=$1
                 RETURNING *`,
                [id]
            );

        } else if (role === "Teacher") {

            result = await pool.query(`
                DELETE FROM course_materials
                WHERE id=$1
                  AND teacher_id = (
                        SELECT id
                        FROM teacher_profiles
                        WHERE user_id=$2
                  )
                RETURNING *
            `, [id, user_id]);

        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Course material not found"
            });
        }

        return res.status(200).json({
            message: "Course material deleted"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}




module.exports={
     createCourseMaterial,
     getCourseMaterial,
     getMyCourseMaterials,
     editCourseMaterial,
     getOneCourseMaterial,
     deleteCourseMaterial
}