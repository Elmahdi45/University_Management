const { pool } = require("../database/db");

async function getProfile(req, res) {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.gender,
        r.name AS role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = $1
      `,
      [user_id]
    );

    if (result.rowCount === 0) {
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

module.exports = {
  getProfile,
};