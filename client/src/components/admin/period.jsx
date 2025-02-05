import { useEffect, useState } from "react";
import { FaHome,FaListAlt } from "react-icons/fa";
const Period=()=>{
    const date_ = new Date();
    const [period, setPeriod] = useState([]);
    
    const [formData,setformdata]=useState({
        year: date_.getFullYear(),
        month:date_.getMonth(),
        name:"",
        activeWorkingDaysInMonth:0,
        active:true

    });
    useEffect(()=>{
        fetchPeriod();
    },[])
    const fetchPeriod = async () => {
        const result = await fetch(`${process.env.REACT_APP_ALL_PERIOD}`).then(
          (res) => res.json().then((data) => setPeriod(data.result))
        );
      };
    const handleFormData = (e)=>{
        const {value,name}= e.target;
        setformdata((prev)=>({...prev,[name]:value}));

    }

const handleSubmit = async()=>{
    if(formData.name=="" ||formData.year=="" ||formData.month==""||formData.activeWorkingDaysInMonth==0){
        alert("adı,yılı,ayı ve çalışılan gün sayısı boş olamaz");
    }
    else {
        const currentMont = formData.month;
       
       const result = await fetch(process.env.REACT_APP_PERIOD,{
        method:'POST',
        headers:new Headers({
            "content-type":"application/json"
        }),
        body:JSON.stringify(formData)
       }) 
       .then(res=>res.json());
       if(result.status==="success"){
        alert("DÖNEM açıldı")
        fetchPeriod();
       
       

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
                            <FaHome /> Dönem Açma
                          </h2>
                        </div>
                        <div className="card">
                          <div className="input-grid">
                            <div className="input-field">
                              <label>Yıl</label>
                              <input
                              type="number"
                                name="year"
                                disabled
                                value={formData.year}
                                onChange={handleFormData}
                              />
                            </div>
                            <div className="input-field">
                              <label>Ay</label>
                              <input
                              type="number"
                              disabled
                                name="month"
                                value={formData.month}
                                onChange={handleFormData}
                              />
                            </div>
                            <div className="input-field">
                              <label>Dönemin adı</label>
                              <input
                                name="name"
                                value={formData.name}
                                onChange={handleFormData}
                              />
                            </div>
                            <div className="input-field">
                              <label>Dönemdeki aktif çalıima gün sayısı</label>
                              <input
                                name="activeWorkingDaysInMonth"
                                value={formData.activeWorkingDaysInMonth}
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
                                <th>Yıl</th>
                                <th>Ay</th>
                                <th>Adı</th>
                                <th>Aktif Çalışma Gün sayısı</th>
                                <th>Durumu</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {period &&
                                period.map((data, index) => (
                                  <tr>
                                    <td>{index + 1}</td>
                                    <td>{data.year}</td>
                                    <td>{data.month+1}</td>
                                    <td>{data.name}</td>
                                    <td>{data.activeWorkingDaysInMonth}</td>
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
export default Period;