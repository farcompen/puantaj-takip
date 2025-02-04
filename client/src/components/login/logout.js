import { replace } from "react-router-dom";

export function logout(){

    localStorage.removeItem("accessToken");
    window.location.reload();

}