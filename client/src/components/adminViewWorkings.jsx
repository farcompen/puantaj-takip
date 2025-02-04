import { useEffect, useState } from "react";
import { FaHome, FaList, FaListAlt,FaCheck,FaWindowClose } from "react-icons/fa";
import { decodeJwt } from "../utils/jwtDecoder";
const AdminViewWorkings = () => {
  const [period, setPeriod] = useState([]);
  const [userList, setUserList] = useState([]);
  const [workingList, setWorkingList] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState({
    name:"",
    id:""
  });
  useEffect(() => {
    fetchPeriod();
  }, []);
  const fetchPeriod = async () => {
    const result = await fetch(`${process.env.REACT_APP_ALL_PERIOD}`).then(
      (res) => res.json().then((data) => setPeriod(data.result))
    );
  };
  const fetchWorkings = async () => {
    const result = await fetch(process.env.REACT_APP_TESISADMINWORKINGLIST, {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
      }),
      body: JSON.stringify({
        postBody: {
          userId: userId,
          periodId: periodId,
        },
      }),
    }).then((res) => res.json());

    setWorkingList(result.workingList);
    setSelectedAdmin(userId);
  };

  const handlePeriodChange = async (e) => {
    const periodValue = e.target.value.split("-")
    setSelectedPeriod({
      name:periodValue[1],
      id:periodValue[0]
    })
  };
  const fetchLocationUsers = async () => {
    const users = await fetch(process.env.REACT_APP_LOCATION_USERS).then(
      (res) => res.json()
    );
    setUserList(users.result);
    console.log(selectedPeriod);
  };

  const fetchWorkingsByCreatedUserId = async (tesisAdminId) => {
 
    ;
      const result = await fetch(
        `${process.env.REACT_APP_ISMADMIN_WORKLIST}`,
        {
          method: "POST",
          body: JSON.stringify({
            postBody: {
              userId: tesisAdminId,
              periodId: selectedPeriod.id,
            },
          }),
          headers: new Headers({
            "content-type": "application/json",
          }),
        }
      ).then((res) => res.json());
  
      setWorkingList(result.workingList);
    };

  return (
    <>
      <div>
        <div
          className="card-header"
          style={{
            backgroundImage:
              " linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)",
            borderBottom: "1px solid #eee",

            marginTop: "0px",
            marginBottom: "5px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "6px",
          }}
        >
          <h2
            style={{
              margin: "10px",
              fontSize: "x-small",
              color: "#333",
              fontWeight: "500",
              fontWeight: "bold",
            }}
          >
            <FaHome /> Puantaj İzleme
          </h2>
        </div>

        <div
          className="card"
          style={{
            maxWidth: "83vw",
            width: "83vw",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 8px 8px rgba(0,0,0,0.1)",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <div className="input-group">
            <label>Dönem:</label>
            <select
              id="donem"
              className="month-dropdown"
              onChange={(e) => handlePeriodChange(e)}
            >
              <option>Seçiniz ..</option>
              {period &&
                period.map((period, index) => (
                  <option
                    key={index}
                    value={`${period._id}-${period.year}/${period.month + 1}`}
                  >
                    {period.month + 1} - {period.year}
                  </option>
                ))}
            </select>
            <button id="sec" className="btn" onClick={fetchLocationUsers}>
              Listele
            </button>
          </div>
        </div>

        {/*Bu tabloya aktif durumdaki admin approve olan tüm işlemler dönem bazlı  gelecek */}
        <div
          className="card"
          style={{
            maxWidth: "83vw",
            width: "83vw",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 8px 8px rgba(0,0,0,0.1)",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <div
            className="card-header"
            style={{
              backgroundImage:
                " linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)",
              borderBottom: "1px solid #eee",

              marginTop: "0px",
              marginBottom: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: "6px",
            }}
          >
            <h2
              style={{
                margin: "10px",
                fontSize: "x-small",
                color: "#333",
                fontWeight: "500",
                fontWeight: "bold",
              }}
            >
              Kurum Veri Sorumlu Listesi
            </h2>
          </div>

          <table className="detail-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tc No</th>
                <th>Personel</th>

                <th>Kurumu</th>
                <th>Birimi</th>
                <th>Dönem</th>

                <th></th>
              </tr>
            </thead>
            <tbody>
              {userList &&
                userList.map((data, index) => (
                  <tr>
                    <td>1</td>
                    <td>{data.identityNumber}</td>
                    <td>
                      {data.name} {data.surname}
                    </td>

                    <td>{data.location.name}</td>
                    <td>{""}</td>

                    <td>{selectedPeriod.name}</td>

                    <td>
                      <button
                        onClick={()=>fetchWorkingsByCreatedUserId(data._id)
                        }
                      >
                        <FaListAlt /> Puantajı Göster
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div
          className="card-header"
          style={{
            backgroundImage:
              " linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)",
            borderBottom: "1px solid #eee",

            marginTop: "0px",
            marginBottom: "5px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "6px",
          }}
        >
          <h2
            style={{
              margin: "10px",
              fontSize: "x-small",
              color: "#333",
              fontWeight: "500",
              fontWeight: "bold",
            }}
          >
            Personel Puantaj Durum
          </h2>
        </div>
        <div
          className="card"
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 8px 8px rgba(0,0,0,0.1)",
            padding: "10px",
            marginBottom: "10px",
            maxWidth: "83vw",
            width: "83vw",
          }}
        >
           <table className="detail-table">
                     <thead>
                       <tr >
                         <th
                   
                         >
                           #
                         </th>
                         <th
                         
                         >
                           Tc No
                         </th>
                         <th
                           
                         >
                           Personel
                         </th>
         
                         <th
                           
                         >
                           Birimi
                         </th>
                         <th
                           
                         >
                           Dönem
                         </th>
                         <th
                           
                         >
                           1. Onay
                         </th>
                         <th
                           
                         >
                           İsm Onay
                         </th>
                         <th
                          
                         >
                           Durum
                         </th>
         
                         <th
                           
                         ></th>
                       </tr>
                     </thead>
                     <tbody >
                       {workingList &&
                         workingList.map((data, index) => (
                           <tr>
                             <td >
                               1
                             </td>
                             <td >
                               {data.user.identityNumber}
                             </td>
                             <td >
                               {data.user.name} {data.user.surname}
                             </td>
         
                             <td >
                               {data.user.branch}
                             </td>
                             <td >
                               {data.period.name}
                             </td>
                             <td >
                               <div>
                                 <FaCheck color="green" />{" "}
                               </div>
                             </td>
                             <td >
                               {data.adminApprove ? (
                                 <div>
                                   {" "}
                                   <FaCheck color="green" />
                                 </div>
                               ) : (
                                 <div>
                                   {" "}
                                   <FaWindowClose color="red" />
                                 </div>
                               )}
                             </td>
                             <td >
                               {data.detail}
                             </td>
         
                             <td  >
                              
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
export default AdminViewWorkings;
