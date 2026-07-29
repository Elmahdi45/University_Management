const express=require("express");

const app=express();


const authRouter=require('./routes/auth');
const registrarRouter=require('./routes/registrar');
const studentRouter=require('./routes/student');
const teacherRouter=require('./routes/teacher');
const anouncementRouter=require('./routes/anouncement');
const departmentRouter=require('./routes/department');


app.use(express.json());

app.use('/auth',authRouter);
app.use('/registrar',registrarRouter);
app.use('/students',studentRouter);
app.use('/teacher',teacherRouter);
app.use('/anouncement',anouncementRouter);
app.use('/department',departmentRouter);

app.listen(3000,()=>{
      console.log("Server is running");
});
