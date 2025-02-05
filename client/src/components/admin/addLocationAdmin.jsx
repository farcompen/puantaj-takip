import { useEffect, useState } from "react";
import { FaHome, FaListAlt } from "react-icons/fa";
const AddLocationAdmin = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [formData, setFormData] = useState({
    identityNumber: "",
    name: "",
    surname: "",
    location: selectedLocation,
    branch: "",
    email: "",
    password: "",
    ustBirim:"",
    active: true,
  });
  const [lcoations, setLocations] = useState([]);
  const [adminList, setAdminList] = useState([]);
  useEffect(() => {
    fetchLocations();
    fetchAdmins();
  }, []);
  const handleFormData = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
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

  const fetchAdmins = async () => {
    const result = await fetch(process.env.REACT_APP_LOCATION_USERS).then(
      (res) => res.json()
    );
    setAdminList(result.result);
  };
  const handleSubmit = async () => {
    formData.location = selectedLocation;
    if (
      formData.identityNumber == "" ||
      formData.email == "" ||
      formData.password == "" ||
      formData.location == ""
    ) {
      alert("kimlik no,eposta,parola, kurumu boş olamaz");
    } else if (formData.password.length < 8) {
      alert("parola en az 8 karakter olmalı");
    } else {
      const result = await fetch(process.env.REACT_APP_ADMIN_ADD, {
        method: "POST",
        headers: new Headers({
          "content-type": "application/json",
        }),
        body: JSON.stringify(formData),
      }).then((res) => res.json());
      if (result.status === "success") {
        alert("Kullanıcı kaydedildi");
        fetchAdmins();
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
            <FaHome /> Veri Giriş Yöneticisi Ekleme
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
              />
            </div>
            <div className="input-field">
              <label>Adı</label>
              <input
                name="name"
                required
                value={formData.name}
                onChange={handleFormData}
              />
            </div>
            <div className="input-field">
              <label>Soyadı</label>
              <input
                name="surname"
                value={formData.surname}
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
                value={formData.branch}
                onChange={handleFormData}
              />
            </div>
            <div className="input-field">
              <label>Üst Birim/bağlı başkanlık</label>
              <input
                name="ustBirim"
                type="text"
                value={formData.ustBirim}
                onChange={handleFormData}
              />
            </div>
            <div className="input-field">
              <label>E-Posta</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormData}
              />
            </div>
            <div className="input-field">
              <label>Parola</label>

              <input
                name="password"
                type="password"
                placeholder="en az 8 karakter giriniz.."
                value={formData.password}
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
            <FaHome /> Kayıtlı Veri Giriş Sorumluları
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
                <th>Epostası</th>

                <th>Durumu</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {adminList &&
                adminList.map((data, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{data.identityNumber}</td>
                    <td>
                      {data.name} {data.surname}
                    </td>

                    <td>{data.location.name}</td>
                    <td>{data.branch}</td>

                    <td>{data.email}</td>
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
export default AddLocationAdmin;
