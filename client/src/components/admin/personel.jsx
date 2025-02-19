import { decodeJwt } from "../../utils/jwtDecoder";
import { useState, useEffect } from "react";
import { FaHome, FaTrashAlt } from "react-icons/fa";
const Personel = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
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
                        className="error"
                        onClick={() => deletePersonel(data._id)}
                      >
                        <FaTrashAlt /> Sil
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
