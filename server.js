
require("dotenv").config();

const express=require("express");

const app=express();


const authRouter=require('./routes/auth');
const registrarRouter=require('./routes/registrar');
const studentRouter=require('./routes/student');
const teacherRouter=require('./routes/teacher');
const anouncementRouter=require('./routes/anouncement');
const departmentRouter=require('./routes/department');
const classRouter=require('./routes/class');


app.use(express.json());

app.use('/auth',authRouter);
app.use('/registrar',registrarRouter);
app.use('/students',studentRouter);
app.use('/teacher',teacherRouter);
app.use('/anouncement',anouncementRouter);
app.use('/department',departmentRouter);
app.use('/class',classRouter);

app.listen(3000,()=>{
      console.log("Server is running");
});
