const {Pool}=require('pg');
const pool =new Pool({ 
      user:"postgres",
      database:"university",
      host:"localhost",
      password:"123456789",
      port:5432
})

module.exports={pool};