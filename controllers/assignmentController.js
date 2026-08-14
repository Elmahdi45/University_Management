const { pool } = require("../database/db");


// =========================
// CREATE ASSIGNMENT
// =========================
async function createAssignment(req, res) {
    try {
        const user_id = req.user.id;

        const {
            module_id,
            title,
            description,
            deadline
        } = req.body;

        if (!module_id || !title || !description || !deadline) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Get teacher profile + verify that he teaches this module
        const checkTeacher = await pool.query(`
            SELECT tp.id AS teacher_id
            FROM teaching_assignments ta
            JOIN teacher_profiles tp
                ON ta.teacher_id = tp.id
            WHERE tp.user_id = $1
              AND ta.module_id = $2
        `, [user_id, module_id]);

        if (checkTeacher.rowCount === 0) {
            return res.status(403).json({
                message: "You are not assigned to teach this module"
            });
        }

        // IMPORTANT:
        // teacher_id = teacher_profiles.id
        const teacher_id = checkTeacher.rows[0].teacher_id;

        const insert = await pool.query(`
            INSERT INTO assignments
                (module_id, title, description, deadline, teacher_id)
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING *
        `, [
            module_id,
            title,
            description,
            deadline,
            teacher_id
        ]);

        return res.status(201).json({
            message: "Assignment created!",
            assignment: insert.rows[0]
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


// =========================
// GET ASSIGNMENTS
// =========================
async function getAssignment(req, res) {
    try {
        const role = req.user.role;
        const user_id = req.user.id;

        let result;

        if (role === "Admin") {

            result = await pool.query(`
                SELECT
                    a.id,
                    a.title,
                    a.description,
                    a.deadline,
                    a.module_id,
                    m.name AS module_name,

                    tp.id AS teacher_id,
                    u.first_name AS teacher_first_name,
                    u.last_name AS teacher_last_name

                FROM assignments a

                JOIN modules m
                    ON a.module_id = m.id

                JOIN teacher_profiles tp
                    ON a.teacher_id = tp.id

                JOIN users u
                    ON tp.user_id = u.id

                ORDER BY a.deadline ASC
            `);

        } else if (role === "Teacher") {

            result = await pool.query(`
                SELECT
                    a.id,
                    a.title,
                    a.description,
                    a.deadline,
                    a.module_id,
                    m.name AS module_name,

                    c.id AS class_id,
                    c.name AS class_name

                FROM assignments a

                JOIN modules m
                    ON a.module_id = m.id

                JOIN teacher_profiles tp
                    ON a.teacher_id = tp.id

                JOIN teaching_assignments ta
                    ON ta.teacher_id = tp.id
                   AND ta.module_id = a.module_id

                JOIN classes c
                    ON ta.class_id = c.id

                WHERE tp.user_id = $1

                ORDER BY a.deadline ASC
            `, [user_id]);

        } else {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No assignments found"
            });
        }

        return res.status(200).json({
            message: "Assignments retrieved",
            assignments: result.rows
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


// =========================
// STUDENT ASSIGNMENTS
// =========================
async function getMyAssignments(req, res) {
    try {
        const user_id = req.user.id;

        const result = await pool.query(`
            SELECT
                a.id,
                a.title,
                a.description,
                a.deadline,

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

            JOIN assignments a
                ON a.module_id = ta.module_id
               AND a.teacher_id = ta.teacher_id

            JOIN modules m
                ON a.module_id = m.id

            JOIN teacher_profiles tp
                ON a.teacher_id = tp.id

            JOIN users u
                ON tp.user_id = u.id

            WHERE sp.user_id = $1

            ORDER BY a.deadline ASC
        `, [user_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No assignments found"
            });
        }

        return res.status(200).json({
            message: "Assignments retrieved",
            assignments: result.rows
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


// =========================
// GET ONE ASSIGNMENT
// =========================
async function getOneAssignment(req, res) {
    try {
        const user_id = req.user.id;
        const role = req.user.role;
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid assignment id"
            });
        }

        let result;

        if (role === "Admin") {

            result = await pool.query(`
                SELECT
                    a.*,
                    m.name AS module_name
                FROM assignments a
                JOIN modules m
                    ON a.module_id = m.id
                WHERE a.id = $1
            `, [id]);

        } else if (role === "Teacher") {

            result = await pool.query(`
                SELECT
                    a.id,
                    a.title,
                    a.description,
                    a.deadline,

                    m.id AS module_id,
                    m.name AS module_name,

                    c.id AS class_id,
                    c.name AS class_name

                FROM assignments a

                JOIN modules m
                    ON a.module_id = m.id

                JOIN teacher_profiles tp
                    ON a.teacher_id = tp.id

                JOIN teaching_assignments ta
                    ON ta.teacher_id = tp.id
                   AND ta.module_id = a.module_id

                JOIN classes c
                    ON ta.class_id = c.id

                WHERE tp.user_id = $1
                  AND a.id = $2
            `, [user_id, id]);

        } else if (role === "Student") {

            result = await pool.query(`
                SELECT
                    a.id,
                    a.title,
                    a.description,
                    a.deadline,

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

                JOIN assignments a
                    ON a.module_id = ta.module_id
                   AND a.teacher_id = ta.teacher_id

                JOIN modules m
                    ON a.module_id = m.id

                JOIN teacher_profiles tp
                    ON a.teacher_id = tp.id

                JOIN users u
                    ON tp.user_id = u.id

                WHERE sp.user_id = $1
                  AND a.id = $2
            `, [user_id, id]);

        } else {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        return res.status(200).json({
            message: "Assignment retrieved",
            assignment: result.rows[0]
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


// =========================
// EDIT ASSIGNMENT
// =========================
async function editAssignment(req, res) {
    try {
        const user_id = req.user.id;
        const role = req.user.role;
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid assignment id"
            });
        }

        const {
            title,
            description,
            deadline
        } = req.body;

        const fields = [];
        const values = [];

        if (title) {
            fields.push(`title = $${values.length + 1}`);
            values.push(title);
        }

        if (description) {
            fields.push(`description = $${values.length + 1}`);
            values.push(description);
        }

        if (deadline) {
            fields.push(`deadline = $${values.length + 1}`);
            values.push(deadline);
        }

        if (fields.length === 0) {
            return res.status(400).json({
                message: "No fields to update"
            });
        }

        let result;

        if (role === "Admin") {

            values.push(id);

            result = await pool.query(`
                UPDATE assignments
                SET ${fields.join(", ")}
                WHERE id = $${values.length}
                RETURNING *
            `, values);

        } else if (role === "Teacher") {

            values.push(user_id);
            values.push(id);

            result = await pool.query(`
                UPDATE assignments
                SET ${fields.join(", ")}

                WHERE id = $${values.length}

                AND teacher_id = (
                    SELECT id
                    FROM teacher_profiles
                    WHERE user_id = $${values.length - 1}
                )

                RETURNING *
            `, values);

        } else {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Assignment not found or you are not allowed to edit it"
            });
        }

        return res.status(200).json({
            message: "Assignment updated",
            assignment: result.rows[0]
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


// =========================
// DELETE ASSIGNMENT
// =========================
async function deleteAssignment(req, res) {
    try {
        const user_id = req.user.id;
        const role = req.user.role;
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid assignment id"
            });
        }

        let result;

        if (role === "Admin") {

            result = await pool.query(`
                DELETE FROM assignments
                WHERE id = $1
                RETURNING *
            `, [id]);

        } else if (role === "Teacher") {

            result = await pool.query(`
                DELETE FROM assignments
                WHERE id = $1

                AND teacher_id = (
                    SELECT id
                    FROM teacher_profiles
                    WHERE user_id = $2
                )

                RETURNING *
            `, [id, user_id]);

        } else {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No assignment to delete"
            });
        }

        return res.status(200).json({
            message: "Assignment deleted",
            assignment: result.rows[0]
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    createAssignment,
    getAssignment,
    getMyAssignments,
    getOneAssignment,
    editAssignment,
    deleteAssignment
};