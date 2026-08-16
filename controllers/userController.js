const { pool } = require("../database/db");
const bcrypt = require("bcrypt");

async function getProfile(req, res) {
  try {
    const user_id = req.user.id;
    const role = req.user.role;

    let result;

    if (role === "Student") {
      result = await pool.query(`
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          u.gender,
          r.name AS role,

          sp.id AS student_profile_id,
          c.id AS class_id,
          c.name AS class_name

        FROM users u

        JOIN roles r
          ON u.role_id = r.id

        JOIN student_profiles sp
          ON sp.user_id = u.id

        LEFT JOIN classes c
          ON sp.class_id = c.id

        WHERE u.id = $1
      `, [user_id]);

    } else if (role === "Teacher") {
      result = await pool.query(`
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          u.gender,
          r.name AS role,
          d.name as department_name,
          tp.id AS teacher_profile_id

        FROM users u

        JOIN roles r
          ON u.role_id = r.id

        JOIN teacher_profiles tp
          ON tp.user_id = u.id
        JOIN departments d 
          ON tp.department_id=d.id

        WHERE u.id = $1
      `, [user_id]);

    } else if (role === "Admin") {
      result = await pool.query(`
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          u.gender,
          r.name AS role

        FROM users u

        JOIN roles r
          ON u.role_id = r.id

        WHERE u.id = $1
      `, [user_id]);

    } else if (role === "Registrar") {
      result = await pool.query(`
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          u.gender,
          r.name AS role,

          rp.id AS registrar_profile_id

        FROM users u

        JOIN roles r
          ON u.role_id = r.id

        JOIN registrar_profiles rp
          ON rp.user_id = u.id

        WHERE u.id = $1
      `, [user_id]);
    }

    if (!result || result.rowCount === 0) {
      return res.status(404).json({
        message: "No user found",
      });
    }

    return res.status(200).json({
      user: result.rows[0],
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
async function updatePassword(req, res) {
  try {
    const user_id = req.user.id;
    const role = req.user.role;

    const {
      currentPassword,
      newPassword
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required"
      });
    }

    if (
      role !== "Student" &&
      role !== "Teacher" &&
      role !== "Registrar" &&
      role !== "Admin"
    ) {
      return res.status(403).json({
        message: "Unauthorized role"
      });
    }

    const result = await pool.query(
      `
      SELECT id, password, role_id
      FROM users
      WHERE id = $1
      `,
      [user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Current password is incorrect"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `
      UPDATE users
      SET password = $1
      WHERE id = $2
      `,
      [hashedPassword, user_id]
    );

    return res.status(200).json({
      message: "Password updated successfully"
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
module.exports = {
  getProfile,
  updatePassword
};