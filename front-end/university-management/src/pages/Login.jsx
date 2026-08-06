import { useState } from "react";
import { Eye,EyeClosed } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";




function Login(){
  
    const navigate=useNavigate();
    const token=localStorage.getItem("token");
    const [showPassword,setShowPassword]=useState(false);

    const loginSchema=z.object({
          email:z.string().min(1,"Email is required").email("Enter a valid email address"),
          password:z.string().min(1,"Password is required"),
          remember:z.boolean().optional(),
    });

    const {
         register,
         handleSubmit,
         formState:{errors,isSubmitting},
    }=useForm({
         resolver:zodResolver(loginSchema),
         defaultValues:{email:"",password:""},
    })

    const onSubmit = async (data) => {
    try {
        const response = await api.post("/auth/login", data);

        localStorage.setItem("token", response.data.token);

        alert(response.data.message);

        navigate("/dashboard");

    } catch (err) {
        alert(err.response?.data?.message || "Login failed");
    }
};
    return (
         <div className="flex h-screen">
              <div className="w-2/5 h-full bg-slate-900 flex flex-col justify-between text-white p-14">
                   <div className="flex items-center gap-4">
                         <div className="bg-slate-700 rounded-lg w-10 h-10 flex items-center justify-center">
                                <GraduationCap></GraduationCap>
                         </div>
                         <h1 className="font-semibold">University Management System</h1>
                   </div>

                   <div className="space-y-5">
                         <h1 className="text-5xl font-bold">Welcome back</h1>
                         <p className="text-slate-300 leading-8 text-lg max-w-md">
                                 Sign in to manage admissions, academic records,
                                course registration and campus services — all in one place.
                       </p>
                   </div>

                   <div className="border-t border-slate-700 pt-6 text-slate-400">
                     © 2026 University Management System. All rights reserved.
                  </div>
              </div>


              <div className="w-3/5 flex items-center justify-center bg-white">
                   <div className="w-full max-w-md"> 
                                 
                       <div className="mb-10">
                            <h1 className="text-4xl font-bold">Sign in</h1>
                            <p className="text-gray-500 mt-3">
                                Enter your credentials to access your account.
                            </p>
                       </div>

                       <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                           <div className="flex flex-col gap-2">
                                <label className="font-medium">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    {...register("email")}
                                    placeholder="youID@role.isga.ma"
                                    className="border rounded-lg px-4 py-3 outline-none focus:border-slate-900 transition"
                                />
                                {errors.email && ( <p className="error">{errors.email.message   }</p> )}
                          </div>

                          <div className="flex flex-col gap-2">
                              <label className="font-medium">
                                   Password
                              </label>

                             <div className="relative">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder="********"
                                    className="w-full border rounded-lg px-4 py-3 pr-12 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900 transition"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                                </button>

                            </div>
                                {errors.password && ( <p className="error">{errors.password.message}</p> )}
                          </div>

                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                 <input type="checkbox" {...register("remember")} />
                                <span>Remember me</span>
                             </div>

                              <button
                                type="button"
                                className="text-slate-900 font-medium hover:underline"
                              >
                                Forgot password?
                             </button>
                               
                          </div>

                         <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>
                       </form>
                   </div>
                  
              </div>
        </div>
    )
}

export default Login;