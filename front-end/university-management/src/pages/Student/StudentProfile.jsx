import { useState,useEffect } from "react";
import Profile from "../../components/Profile";
import api from "../../api/axios";


function StudentProfile(){
     const [user,setUser]=useState([]);
     const [role,setRole]=useState([]);

     async function loadProfile(){
          try{
              const response=await api.get('/profile');
              setUser(response.data.user);
          }
          catch(err){
             console.log(err);
          }
     }
     useEffect(()=>{
         loadProfile();
     },[])

     if(!user){
         return (
             <div>Loading...</div>
         )
     }

     return(
        <Profile user={user} role={user.role}>
                 
        </Profile>
     )

     
}
export default StudentProfile;