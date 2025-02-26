import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { decodeJwt } from "../../utils/jwtDecoder";
let roles =JSON.parse(process.env.REACT_APP_ROLES);
const Login =()=>{
    const  nav = useNavigate();
    const [formdata,setFormdata]=useState({
        username:"",
        password:"",
    })
    const handleChange=(event)=>{
        const {name,value}=event.target;
        setFormdata((prevState)=>({...prevState,[name]:value}))

    }
   


    const handleSubmit =async ()=>{
     
        if(formdata.username=="" ||formdata.password==""){
            alert("Kullanıcı adı ya da parola boş olamaz")
        }
        else {
            const result = await fetch(process.env.REACT_APP_LOGIN_URL,{
                method:"POST",
                headers:new Headers({
                    "content-type":"application/json"
                }),
                body:JSON.stringify({
                    username:formdata.username,
                    password:formdata.password
                })
            }).then(res=>res.json())
            .catch((err)=>{
                alert(err)
            })
            if(result.status==="success"){
               
                localStorage.setItem("accessToken",result.accessToken)
                const {role} = decodeJwt(result.accessToken);
             console.log(roles)
                if(role==roles.ismAdmin){
                nav("/adminworkings",{replace:true});
                window.location.reload();
             }
             else if (role ==roles.tesisAdmin){
                nav("/main",{replace:true});
                window.location.reload();
             }  
            }
            else {
                alert(result.message)
            }
        }

    }
    return(
        <>
        <div className="login-container" style={{
            justifyContent: "center",
            maxWidth: "400px",
            maxHeight:"300px",
            margin: "80px auto",
            padding: "30px",
            boxShadow: "0 0 20px rgba(0,0,0,0.3)",
            borderRadius: "16px",
            backgroundColor: "#fff"
        }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <svg 
                    width="64" 
                    height="64" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#007bff"
                    strokeWidth="2"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <rect x="3" y="8" width="4" height="12" />
                    <rect x="10" y="4" width="4" height="16" />
                    <rect x="17" y="12" width="4" height="8" />
                </svg>
                <h1 style={{ 
                    fontSize: "24px",
                    color: "#333",
                    marginTop: "10px"
                }}>
                    Puantaj Takip Sistemi
                </h1>
            </div>
          
            
            <div style={{marginBottom: "15px"}}>
                <input 
                    type="text"
                    name="username"
                    value={formdata.username}
                    placeholder="Kullanıcı Adı"
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        marginBottom: "10px"
                    }}
                />
                <input 
                    type="password"
                    name="password"
                    value={formdata.password}
                    placeholder="Şifre"
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "4px"
                    }}
                    onChange={handleChange}
                />
            </div>
            <button 
                style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}
                onClick={handleSubmit}
            >
                Giriş Yap
            </button>
        </div>
        </>
    )

}
export default Login; 