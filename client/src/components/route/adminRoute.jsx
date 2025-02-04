import {isExpired, useJwt} from "react-jwt";
import { Navigate } from "react-router-dom";
import Navbar from "../Navbar/navbar";
import AdminSidebar from "../Sidebar/adminSideBar";
import Sidebar from "../Sidebar/sidebar";
const ProtectedAdminRoute =({children})=>{
    const accessToken = localStorage.getItem("accessToken");
   const jwt = useJwt(accessToken);
   
    if(!jwt ||jwt.isExpired || accessToken==""||accessToken==undefined ){
        console.log("isExpired")
        return <  Navigate to="/login"/>
    }
    else return (
        <>
         <div className="app">
            <Navbar/>
            <AdminSidebar/>
            <div className="main-content">
            {children}
        </div>
        
        </div>
       
        </>
       
        

    )


}
export default ProtectedAdminRoute;