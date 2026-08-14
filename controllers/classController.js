const {pool}=require('../database/db');

async function createClass(req,res){
      try{
            const {class_name,department_id}=req.body;
            if(isNaN(department_id)){
                     return res.status(400).json({message:"Invalid department id"});
            }
            if(!class_name || !department_id){
                   return res.status(400).json({mesasge:"Fields are required"});
            }

            const checkDepartmentId=await pool.query('select id,name from departments where id=$1',[department_id]);
            if(checkDepartmentId.rowCount===0){
                  return res.status(404).json({message:"No department with that id found"});
            }
const result=await pool.query('select classes.name as class_name,departments.name as department_name,classes.id from classes join departments on classes.department_id=departments.id where classes.name=$1 and department_id=$2',[class_name,department_id]);
            if(result.rowCount>0){
                  return res.status(409).json({message:"Class already exists"});
            }
            const insert=await pool.query('insert into classes("name","department_id") values($1,$2) returning *',[class_name,department_id]);
            if(insert.rowCount===0){
                  return res.status(404).json({message:"No calss found"});
            }
            return res.status(201).json({
                message: "Class created",
                class: insert.rows[0]
            });
      }
      catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}

async function getClasses(req,res){
      try{ 
           const result=await pool.query('select classes.name as class_name, classes.id,departments.name as department_name,departments.id as department_id from classes join departments on classes.department_id=departments.id');
           if(result.rowCount===0){
              return res.status(404).json({message:"No classes found"});
           }
           return res.status(200).json(result.rows);
      }
      catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}
async function getMyClasses(req, res) {
    try {
        const user_id = req.user.id;

        const result = await pool.query(`
            SELECT DISTINCT
                c.id,
                c.name,
                d.name AS department_name,
                COUNT(DISTINCT sp.id) AS student_count

            FROM teacher_profiles tp

            JOIN teaching_assignments ta
                ON ta.teacher_id = tp.id

            JOIN classes c
                ON ta.class_id = c.id

            LEFT JOIN departments d
                ON c.department_id = d.id

            LEFT JOIN student_profiles sp
                ON sp.class_id = c.id

            WHERE tp.user_id = $1

            GROUP BY
                c.id,
                c.name,
                d.name

            ORDER BY c.name
        `, [user_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "No classes found"
            });
        }

        return res.status(200).json({
            message: "Classes retrieved",
            classes: result.rows
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function getOneClass(req,res){
      try{
         const id=Number(req.params.id);
           if(isNaN(id)){
               return res.status(400).json({message:"Invalid department id"});
           }

        const result=await pool.query('select classes.name as class_name,departments.name as department_name,departments.id as department_id from classes join departments on classes.department_id=departments.id where classes.id=$1',[id]);
        if(result.rowCount===0){
              return res.status(404).json({message:"No classes found"});
        }
        return res.status(200).json(result.rows[0]);
      }
       catch(err){
          console.log(err);
          return res.status(500).json({message:"Internal server error"});
      }
}
async function editClass(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid class id"
            });
        }

        const { class_name, department_id } = req.body;

        if (!class_name && !department_id) {
            return res.status(400).json({
                message: "No fields to update"
            });
        }
        const currentClass = await pool.query(
            "SELECT * FROM classes WHERE id = $1",
            [id]
        );

        if (currentClass.rowCount === 0) {
            return res.status(404).json({
                message: "Class not found"
            });
        }
        if (department_id) {
            const checkDepartment = await pool.query(
                "SELECT id FROM departments WHERE id = $1",
                [department_id]
            );

            if (checkDepartment.rowCount === 0) {
                return res.status(404).json({
                    message: "Department not found"
                });
            }
        }
        const finalClassName =
            class_name || currentClass.rows[0].name;

        const finalDepartmentId =
            department_id || currentClass.rows[0].department_id;

        const duplicate = await pool.query(
            `SELECT id
             FROM classes
             WHERE name = $1
             AND department_id = $2
             AND id <> $3`,
            [finalClassName, finalDepartmentId, id]
        );

        if (duplicate.rowCount > 0) {
            return res.status(409).json({
                message: "A class with this name already exists in this department"
            });
        }

        const updates = [];
        const values = [];

        if (class_name) {
            updates.push(`name=$${values.length + 1}`);
            values.push(class_name);
        }

        if (department_id) {
            updates.push(`department_id=$${values.length + 1}`);
            values.push(department_id);
        }

        values.push(id);

        const result = await pool.query(
            `UPDATE classes
             SET ${updates.join(", ")}
             WHERE id=$${values.length}
             RETURNING *`,
            values
        );

        return res.status(200).json({
            message: "Class updated successfully",
            class: result.rows[0]
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function deleteClass(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid class id"
            });
        }
        const result = await pool.query(
            "DELETE FROM classes WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        return res.status(200).json({
            message: "Class deleted successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports={
     createClass,
     getClasses,
     getOneClass,
     editClass,
     deleteClass,
     getMyClasses
}