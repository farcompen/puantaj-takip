

import { useEffect, useState } from "react";
import { FaHome, FaListAlt, FaPlus, FaPlusCircle, FaPlusSquare, FaRegSave, FaSave } from "react-icons/fa";
const Period = () => {
  const date_ = new Date();
  const [period, setPeriod] = useState([]);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState({
    identityNumber: "",
    name: "",
    surname: "",
    _id:"",
    branch:""
  });
  const [branchPuantajParameters,setbranchPuantajParameters]=useState([])

  const [selectedPuantajOnfo,setselectedPuantajInfo]=useState({
    activeWorkingDaysInMonth:0,
    activeHours:0

  })
  const [formData, setformdata] = useState({
    year: date_.getFullYear(),
    month: date_.getMonth(),
    name: "",
    
    active: true,
  
   
  });
  useEffect(() => {
    fetchPeriod();
    fetchLocationUsers();
  }, [branchPuantajParameters]);
  const fetchLocationUsers = async () => {
    const users = await fetch(process.env.REACT_APP_LOCATION_USERS).then(
      (res) => res.json()
    );
    setUserList(users.result);
  };
  const fetchPeriod = async () => {
    const result = await fetch(`${process.env.REACT_APP_ALL_PERIOD}`).then(
      (res) => res.json().then((data) => setPeriod(data.result))
    );
  };
  const handleFormData = (e) => {
    const { value, name } = e.target;
    setformdata((prev) => ({ ...prev, [name]: value }));
  };
  const handleUser = (e) => {
    const user = JSON.parse(e)
    setSelectedUser(user)
  
  };
  const handlePuantajInfo =(e)=>{
    const {name,value}=e.target;
    setselectedPuantajInfo((prev)=>({...prev,[name]:value}))
   
  
  }
  const setPuantajTableValues=()=>{
    setbranchPuantajParameters((prev)=>([...prev,{
        name:selectedUser.name,
        id:selectedUser._id,
        branch:selectedUser.branch,
        surname:selectedUser.surname,
        activeWorkingDaysInMonth:selectedPuantajOnfo.activeWorkingDaysInMonth,
        activeHours:selectedPuantajOnfo.activeHours

    }]))
    // branchPuantajParameters.push({
    //     name:selectedUser.name,
    //     id:selectedUser._id,
    //     branch:selectedUser.branch,
    //     surname:selectedUser.surname,
    //     activeWorkingDaysInMonth:selectedPuantajOnfo.activeWorkingDaysInMonth,
    //     activeHours:selectedPuantajOnfo.activeHours

    // })
  


  }
  const handleSubmit = async () => {
   
    if (
      formData.name == "" ||
      formData.year == "" ||
      formData.month == "" ||
      branchPuantajParameters.length==0
     
    ) {
      alert("Periyod ad, yıl, ay bilgisi boş olamaz ve putanj listesi 0 olamaz");
    } else {
      const currentMont = formData.month;
     const period = {
        year:formData.year,
        month:formData.month,
        name:formData.name,
        detail:branchPuantajParameters,
        active:true


     }
      const result = await fetch(process.env.REACT_APP_PERIOD, {
        method: "POST",
        headers: new Headers({
          "content-type": "application/json",
        }),
        body: JSON.stringify(period),
      }).then((res) => res.json());
      if (result.status === "success") {
        alert("DÖNEM açıldı");
        fetchPeriod();
      } else {
        alert(result.message);
      }
    }
  };

  return (
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
          <button className="btn btn-right" onClick={handleSubmit}>
            <FaSave/> Kaydet 
          </button>
              
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
            
          </div>
        
        </div>
        <div className="card-header" >
            <h2
            style={{
              margin: "10px",
              fontSize: "x-small",
              color: "#333",
              fontWeight: "500",
              fontWeight: "bold",
            }}> Birim Çalışma Bilgisi Giriş</h2></div>
            <div className="card">
                <div className="input-grid">
                <div className="input-field">
              <label>Birim seç</label>
              <select
                id="selectedUser"
                className="month-dropdown"
                onChange={(e) => handleUser(e.target.value)}
              >
                <option>Seçiniz ..</option>
                {userList &&
                  userList.map((user, index) => (
                    <option key={index} value={JSON.stringify(user)}>
                      {user.name} {user.surname} / {user.branch}
                    </option>
                  ))}
              </select>
            </div>
            <div className="input-field">
              <label>Dönemdeki aktif çalıima gün sayısı</label>
              <input
                type="number"
                name="activeWorkingDaysInMonth"
                value={branchPuantajParameters.activeWorkingDaysInMonth}
                onChange={handlePuantajInfo}
              />
            </div>
            <div className="input-field">
              <label>Günlük çalışma saati</label>
             
              <input
                type="number"
                name="activeHours"
                value={branchPuantajParameters.activeHours}
                onChange={handlePuantajInfo}
              />
              <button className="btn"
              onClick={setPuantajTableValues}
              ><FaPlusCircle/> Listeye ekle</button>
              
            </div>
          
            
                </div>
                <div>
               <table className="detail-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>adı soyadı </th>
                        <th>Birimi</th>
                        <th>Aydaki aktif çalışma gün sayısı </th>
                        <th>Günlük çalışma saati</th>
                    </tr>
                </thead>
                <tbody>
                  {branchPuantajParameters&&branchPuantajParameters.map((data,index)=>
                (
                  data.activeHours!=0?(
                  <tr>
                        <td>{index}</td>
                        <td>{data.name} {data.surname}</td>
                        <td>{data.branch}</td>
                        <td>{data.activeWorkingDaysInMonth}</td>
                        <td>{data.activeHours}</td>
                    </tr>
                  ):null
                )
                )}

                </tbody>
               
               </table>
              
            </div>
            
           
           
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
            Açılan dönemler
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
                
               <th></th>
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
                    <td>{data.month + 1}</td>
                    <td>{data.name}</td>
                    <td>
                        {
                            data.detail.map((dt)=>(
                                <div style={{ whiteSpace: 'pre-line' }}>
                                    {`${dt.name} ${dt.surname} / ${dt.branch} / gün:${dt.activeWorkingDaysInMonth} / saat:${dt.activeHours}`}
                                </div>
                              
                        
                            ))
                        }</td>
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
  );
};
export default Period;
