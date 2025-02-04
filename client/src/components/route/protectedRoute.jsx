import {isExpired, useJwt} from "react-jwt";
import { Navigate } from "react-router-dom";
import Navbar from "../Navbar/navbar";
import Sidebar from "../Sidebar/sidebar";
const ProtectedRoute =({children})=>{
    const accessToken = localStorage.getItem("accessToken");
   const jwt = useJwt(accessToken);
   console.log(jwt);
    if(!jwt ||jwt.isExpired || accessToken==""||accessToken==undefined ){
        console.log("isExpired")
        return <  Navigate to="/login"/>
    }
    else return (
        <>
         <div className="app">
            <Navbar/>
            <Sidebar/>
            <div className="main-content">
        {children}
        </div>
           
        </div>
       
        </>
       
        

    )


}
export default ProtectedRoute;