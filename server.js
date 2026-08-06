
require("dotenv").config();
const express=require("express");
const cors = require("cors");

const app=express();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);


const authRouter=require('./routes/auth');
const registrarRouter=require('./routes/registrar');
const studentRouter=require('./routes/student');
const teacherRouter=require('./routes/teacher');
const anouncementRouter=require('./routes/anouncement');
const departmentRouter=require('./routes/department');
const classRouter=require('./routes/class');
const moduleRouter=require('./routes/modules');
const enrollmentRouter=require('./routes/enrollments');
const teachingAssignmentRouter=require('./routes/TeachingAssignment');
const attendanceRouter=require('./routes/attendance');
const gradeRouter=require('./routes/grades');
const assignmentRouter=require('./routes/assignment');
const courseMaterialRouter=require('./routes/courseMaterial');
const submissionsRouter=require('./routes/submissions');
const adminRouter=require('./routes/admins');
app.use(express.json());

app.use('/auth',authRouter);
app.use('/registrar',registrarRouter);
app.use('/students',studentRouter);
app.use('/teacher',teacherRouter);
app.use('/anouncement',anouncementRouter);
app.use('/department',departmentRouter);
app.use('/class',classRouter);
app.use('/module',moduleRouter);
app.use('/enrollments',enrollmentRouter);
app.use('/teachingAssignment',teachingAssignmentRouter);
app.use('/attendance',attendanceRouter);
app.use('/grades',gradeRouter);
app.use('/assignment',assignmentRouter);
app.use('/course',courseMaterialRouter);
app.use('/submissions',submissionsRouter);
app.use('/admins',adminRouter);
app.listen(3000,()=>{
      console.log("Server is running");
});
