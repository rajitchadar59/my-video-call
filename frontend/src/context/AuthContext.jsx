import { createContext } from "react";
import axios from 'axios'
import { useContext ,useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext=createContext({});




export const AuthProvider=({children})=>{

    const authContext=useContext(AuthContext);
    const [userData, setuserData] = useState(authContext);

    const router=useNavigate();

    const handleRegister=async(name ,username ,password)=>{
      
        try{

            let request=  await axios.post("http://localhost:3000/api/v1/users/register" ,{
                name:name,
                username:username,
                password:password
            })


            if(request.status==201){
                return request.data.message;
            }

        }catch(err){

           const msg = err?.response?.data?.message || err.message || "Registration failed";
           throw new Error(msg);

        }

    }


    const handleLogin=async(username ,password)=>{


        try{

            let request=  await axios.post("http://localhost:3000/api/v1/users/login" ,{
                username:username,
                password:password
            })


            if(request.status==201){
                localStorage.setItem("token", request.data.token);
                router("/home")
            }

        }catch(err){

           const msg = err?.response?.data?.message || err.message || "Registration failed";
           throw new Error(msg);

        }



      
    }


    const getUserHistory= async()=>{
        try{
            let request=await axios.get("http://localhost:3000/api/v1/users/get_all_activity",{
               params:{
                token:localStorage.getItem("token")
               }
            })

            return request.data;
        }
        catch(err){
            throw err;
        }
    }


    const addUserHistory=async(meetingCode)=>{
         try{
            let request=await axios.post("http://localhost:3000/api/v1/users/add_to_activity",{
              token:localStorage.getItem("token"),
              meetingCode:meetingCode
            })

            return request;
        }
        catch(err){
            throw err;
        }
    }

    const data={
        userData,setuserData ,handleRegister ,handleLogin ,getUserHistory ,addUserHistory
    }

    return(
        <>

        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
        
        </>
    )




}
