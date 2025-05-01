import React from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
export default function ProtectedRoutes({children}) {
    let token =Cookies.get('token')
   try{
    const decoded = jwtDecode(token);
    
    // console.log(decoded);
   }
   catch(err){
    console.log("err")
    Cookies.remove('token');

       return <Navigate to="/signin" />
   }


    if(token)  return children

    return <Navigate to="/signin" />
 
}
