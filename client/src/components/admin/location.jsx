import { useEffect, useState } from "react";
import { FaHome,FaListAlt } from "react-icons/fa";
const Location = ()=>{
    const [formData,setFormdata]=useState({
        name:"",
        active:true
    })

    const[locations,setLocations]=useState([]);
   useEffect(()=>{
    fetchLocations();
},[])
    const fetchLocations = async () => {
       
          const result = await fetch(process.env.REACT_APP_LOCATIONS).then((res) =>
            res.json()
          );
          setLocations(result.locations);
         
        
      };
    const handleFormData=(e)=>{
       const {name,value}=e.target;
        setFormdata((prev)=>({...prev,[name]:value}))

    }

    const handleSubmit=async ()=>{

        if(formData.name==""){
            alert("Kurum adı boş olamaz");
        }
        else {
           const result = await fetch(process.env.REACT_APP_LOCATIONS,{
            method:'POST',
            headers:new Headers({
                "content-type":"application/json"
            }),
            body:JSON.stringify(formData)
           }) 
           .then(res=>res.json());
           if(result.status==="success"){
            alert("Kurum kaydedildi")
            formData.name="";
            setLocations([...locations,result.location])
            if(localStorage.getItem("locations")){
                localStorage.setItem("locations",JSON.stringify([...locations,result.location]))
            }
           }
           else {
            alert(result.message)
           }

        }
    }

    return(
        <>
              <div>
                <div className="card-header">
                  <h2
                    style={{
                      margin: "10px",
                      fontSize: "x-small",
                      color: "#333",
                      fontWeight: "500",
                      fontWeight: "bold",
                    }}
                  >
                    <FaHome /> Kurum Kayıt
                  </h2>
                </div>
                <div className="card">
                  <div className="input-grid">
                    <div className="input-field">
                      <label>Kurum Adı</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleFormData}
                      />
                    </div>
                    
                  </div>
                  <button className="btn btn-submit btn-end" onClick={handleSubmit}>
                    Kaydet
                  </button>
                </div>
        
                <div className="card-header">
                  <h2
                    style={{
                      margin: "10px",
                      fontSize: "x-small",
                      color: "#333",
                      fontWeight: "500",
                      fontWeight: "bold",
                    }}
                  >
                    <FaHome /> Kurum Listesi
                  </h2>
                </div>
                <div className="card">
                  <table className="detail-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        
                        <th>Adı</th>
        
                        
                        <th>Durumu</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {locations &&
                        locations.map((data, index) => (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{data.name}</td>
                            <td>
                              {data.active ? (
                                <div
                                  style={{
                                    color: "green",
                                  }}
                                >
                                  Aktif
                                </div>
                              ) : (
                                <div
                                  style={{
                                    color: "red",
                                  }}
                                ></div>
                              )}
                            </td>
                            <td>
                              <button className="btn btn-submit">
                                <FaListAlt /> Detay
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>

    )
}
export default Location;