import { decodeJwt } from "../../utils/jwtDecoder";
import { useState, useEffect } from "react";
import { FaEdit, FaHome, FaTrashAlt,FaCheckCircle,FaWindowClose } from "react-icons/fa";
const Personel = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [selectedUserId,setselectedUserId]=useState("");
  const [formData, setFormData] = useState({
    identityNumber: "",
    name: "",
    surname: "",
    location: selectedLocation,
    branch: "",
    adminId: "",
    mahsuplasmaValue: 0,
    active: true,
  });
  const [updateFOrmdata,setupdateFOrmdata]=useState({
    mahsuplasma:formData.mahsuplasmaValue
  })
  const [lcoations, setLocations] = useState([]);
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    fetchLocations();
    fetchUsers();
  }, []);
  const handleFormData = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value.toLocaleUpperCase(),
    }));
  };

  const fetchLocations = async () => {
    if (localStorage.getItem("locations")) {
      const loc = localStorage.getItem("locations");
      setLocations(JSON.parse(loc));
    } else {
      const result = await fetch(process.env.REACT_APP_LOCATIONS).then((res) =>
        res.json()
      );
      setLocations(result.locations);
      localStorage.setItem("locations", JSON.stringify(result.locations));
    }
  };
  const handleLocation = (e) => {
    setSelectedLocation(e);
  };

  const deletePersonel=async (id)=>{
    const result = await fetch(`${process.env.REACT_APP_PERSONEL}/${id}`,{
        method:'PATCH',
        body:JSON.stringify({
            active:false
        }),
        headers : new Headers({
            "content-type":"application/json"
        })
    }).then(res=>res.json());
    if(result.status==="success"){
        await fetchUsers();
    }

  }

  const fetchUsers = async () => {
    const { id } = decodeJwt(localStorage.getItem("accessToken"));
    const result = await fetch(`${process.env.REACT_APP_PERSONEL}/${id}`).then(
      (res) => res.json()
    );
    setUserList(result.users);
  };

  const handleSelectedUser=(id)=>{
    setselectedUserId(id);
    setIsModalOpen(true);

  }
  const handleUpdateMahsuplasma=(e)=>{
    const {name,value}=e.target;
    setupdateFOrmdata((prev)=>({...prev,[name]:value}))

  }
  const updateUser=async()=>{
    const userId = selectedUserId;
    const result = await fetch(`${process.env.REACT_APP_PERSONEL}/${userId}`,{
        method:'PATCH',
        headers:new Headers({
            "content-type":"application/json"
        }),
        body :JSON.stringify({
            mahsuplasmaValue:updateFOrmdata.mahsuplasma
        })
    }).then(res=>res.json())
    if(result.status==="success"){
        await fetchUsers();
        setIsModalOpen(false);
    }
    else {
        alert(result.message)
    }


  }
  const handleSubmit = async () => {
    formData.location = selectedLocation;
    if (
      formData.identityNumber == "" ||
      formData.name == "" ||
      formData.surname == "" ||
      formData.location == ""
    ) {
      alert("kimlik no , adı ,soyadı, kurumu boş olamaz");
    } else {
      const { id } = decodeJwt(localStorage.getItem("accessToken"));
      formData.adminId = id;
      const result = await fetch(process.env.REACT_APP_PERSONEL, {
        method: "POST",
        headers: new Headers({
          "content-type": "application/json",
        }),
        body: JSON.stringify(formData),
      }).then((res) => res.json());
      if (result.status === "success") {
        alert("Kullanıcı kaydedildi");
        fetchUsers();
      } else {
        alert(result.message);
      }
    }
  };
  return (
    <>
      <div>
          <div className="modal-overlay" style={{ display: isModalOpen ? 'flex' : 'none' }}>
            <div className="modal">
              <div className="modal-header">
             {`Personel Güncelle`}
                
              </div>
              <div className="modal-content">
              <div className="input-group">
                <label>Mahsuplaşma Değeri</label>
                <input type="number"
                value={updateFOrmdata.mahsuplasmaValue}
                name="mahsuplasma"
                onChange={handleUpdateMahsuplasma} />
                
              </div>
             
              {/* <div style={{backgroundColor:'gainsboro', fontSize:'x-small', display: 'flex', alignItems:'center', gap: '8px', width:'25%' }}>
                <label htmlFor="bbb-checkbox">Mahsuplaşma yapılsın</label>
                <input type="checkbox" id="mahsuplasma-checkbox" onClick={()=>setCheckClassName("")} />
                <div className={checkClassName}>
                <label htmlFor="ccc-checkbox">Mahsuplaşacak saati giriniz</label>
                <input   type="number"   id="mahsuplasilan" name="mahsuplasilan"
                value={formdata.mahsuplasilan}
                onChange={handleFormdata}
                style={{borderTop:'6px',borderBlockColor:'blue',backgroundColor:'darkorange',fontSize:'x-small'}}/>
                </div>
                
              </div> */}
             
              </div>
              
              
              <div className="modal-footer">
                <button className="btn btn-success" onClick={() => updateUser()}>Güncelle <FaCheckCircle/></button>
                <button className="btn btn-red" onClick={() => setIsModalOpen(false)}>Kapat <FaWindowClose/></button>
              </div>
              <div>
                
              </div>
            </div>
            <style jsx>{`
                .modal-overlay {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: rgba(0, 0, 0, 0.5);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  z-index: 1000;
                  overflow-x:scroll;
                }
        
                .modal {
                  background: white;
                  border-radius: 8px;
                  padding: 20px;
                  width: 70%;
                  height:70%;
                   overflow-x:scroll;
                  
                }
        
                .modal-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 15px;
                }
        
                .close-button {
                  background: none;
                  border: none;
                  font-size: 24px;
                  cursor: pointer;
                  padding: 0;
                  color: #666;
                }
        
                .modal-content {
                  margin-bottom: 20px;
                }
        
                .modal-footer {
                  display: flex;
                  gap:2px;
                  justify-content: flex-end;
                }
        
                .modal-footer .button {
                  padding: 8px 16px;
                  background-color: #007bff;
                  color: white;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                }
        
                .modal-footer .button:hover {
                  background-color: #0056b3;
                }
              `}</style>
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
            <FaHome /> Birim Çalışanı Ekleme
          </h2>
        </div>
        <div className="card">
          <div className="input-grid">
            <div className="input-field">
              <label>TC Kimlik No</label>
              <input
                name="identityNumber"
                value={formData.identityNumber}
                onChange={handleFormData}
                UPPER
              />
            </div>
            <div className="input-field">
              <label>Adı</label>
              <input
                name="name"
                required
                value={formData.name.toLocaleUpperCase()}
                onChange={handleFormData}
              />
            </div>
            <div className="input-field">
              <label>Soyadı</label>
              <input
                name="surname"
                value={formData.surname.toLocaleUpperCase()}
                onChange={handleFormData}
              />
            </div>
            <div className="input-field">
              <label>Kurumu</label>
              <select
                id="location"
                className="month-dropdown"
                onChange={(e) => handleLocation(e.target.value)}
              >
                <option>Seçiniz ..</option>
                {lcoations &&
                  lcoations.map((location, index) => (
                    <option key={index} value={location._id}>
                      {location.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="input-field">
              <label>Birimi</label>
              <input
                name="branch"
                value={formData.branch.toLocaleUpperCase()}
                onChange={handleFormData}
              />
            </div>
            <div className="input-field">
              <label>Mahsuplaşma Değeri(saat)</label>
              <input
                defaultValue={0}
                name="mahsuplasmaValue"
                value={formData.mahsuplasmaValue}
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
            <FaHome /> Birimdeki Kayıtlı Personeller
          </h2>
        </div>
        <div className="card">
          <table className="detail-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tc No</th>
                <th>Adı Soyadı</th>

                <th>Kurumu</th>
                <th>Birimi</th>

                <th>Mahsuplaşma (saat) </th>
                <th>Durumu</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {userList &&
                userList.map((data, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{data.identityNumber}</td>
                    <td>
                      {data.name} {data.surname}
                    </td>

                    <td>{data.location.name}</td>
                    <td>{data.branch}</td>
                    <td>{data.mahsuplasmaValue}</td>

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
                      <button
                        className="btn btn-red"
                        onClick={() => deletePersonel(data._id)}
                      >
                        <FaTrashAlt /> Sil
                      </button>
                      <button
                        className="btn btn-success"
                        style={{marginLeft:"2px"}}
                        onClick={() => handleSelectedUser(data._id)}
                      >
                        <FaEdit /> Düzenle
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
export default Personel;
