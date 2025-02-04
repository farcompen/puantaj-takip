import { useEffect, useState } from "react";
import { decodeJwt } from "../utils/jwtDecoder";
import {
  Fa500Px,
  FaCheck,
  FaEraser,
  FaTrashAlt,
  FaWindowClose,
} from "react-icons/fa";

/*
Tesis Admin working detail

*/

const WorkingDetail = () => {
  const [period, setPeriod] = useState([]);
  const [workingList, setWorkingList] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [working, setSelectedWorking] = useState({
    dayHour: [],
    user: "",
  });

  useEffect(() => {
    fetchPeriod();
  }, []);
  const fetchPeriod = async () => {
    const result = await fetch(`${process.env.REACT_APP_ALL_PERIOD}`).then(
      (res) => res.json().then((data) => setPeriod(data.result))
    );
  };
  const fetchWorkingsByCreatedUserId = async () => {
    const token = localStorage.getItem("accessToken");
    const { id } = decodeJwt(token);
    const result = await fetch(
      `${process.env.REACT_APP_TESISADMINWORKINGLIST}`,
      {
        method: "POST",
        body: JSON.stringify({
          postBody: {
            userId: id,
            periodId: selectedPeriod,
          },
        }),
        headers: new Headers({
          "content-type": "application/json",
        }),
      }
    ).then((res) => res.json());

    setWorkingList(result.workingList);
  };
  const handlePeriodChange = (e) => {
    setSelectedPeriod(e);
  };
  const deleteWorking = async (id) => {
    const result = await fetch(
      `${process.env.REACT_APP_WORKINGSBYPERIOD_API_URL}/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          active: false,
        }),
        headers: new Headers({
          "content-type": "application/json",
        }),
      }
    ).then((res) => res.json());

    if (result.status == "success") {
      await fetchWorkingsByCreatedUserId();
    } else {
      alert(result.message);
    }
  };
const showWorking = async(id)=>{
  const result = await fetch(`${process.env.REACT_APP_BYWORKID}/${id}`)
                  .then(res=>res.json());
            if(result.status=="success"){
              setSelectedWorking(result.work)
            }      


}
  return (
    <>
      <div>
        <div className="input-group">
          <label htmlFor="donem">Dönem Seçiniz</label>
          <select
            id="donem"
            className="month-dropdown"
            onChange={(e) => handlePeriodChange(e.target.value)}
          >
            <option>Seçiniz ..</option>
            {period &&
              period.map((period, index) => (
                <option key={index} value={period._id}>
                  {period.month + 1} - {period.year}
                </option>
              ))}
          </select>
          <button
            id="sec"
            className="btn"
            onClick={fetchWorkingsByCreatedUserId}
          >
            Listele
          </button>
        </div>
        {/*Bu tabloya aktif durumdaki admin approve olan tüm işlemler dönem bazlı  gelecek */}
        
        <div
            className="card-header"
          
          >
            <h2
              style={{
                margin: "10px",
                fontSize: "small",
                color: "#333",
                fontWeight: "500",
                fontWeight: "bold",
              }}
            >
              Puantaj Listesi
            </h2>
          </div>
        <div
         
          className="card"
        
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
                    <button
                        
                        onClick={() => showWorking(data._id)}
                      >
                        <FaTrashAlt /> Detay
                      </button>
                      <button
                      className="error"
                      
                        onClick={() => deleteWorking(data._id)}
                      >
                        <FaTrashAlt /> Sil
                      </button> 
                     
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div
            className="card-header"
            
            
          >
            <h2
              style={{
                margin: "10px",
                fontSize: "small",
                color: "#333",
                fontWeight: "500",
                fontWeight: "bold",
              }}
            >
              Puantaj Detay
            </h2>
          </div>
        <div className="card">
          
          <table
           className="detail-table"
          >
            <thead>
              <tr>
                <th>TC NO</th>
                <th>Adı Soyadı</th>

                {/* {working??working.map((wrk)=>(
              wrk.dayHour.map((day)=>(
                <td>{day.day}</td>
              ))
            )) } */}
                {working && working.dayHour.map((day) => <th>{day.day}</th>)}
                <th>Aktif Çalışma Süresi</th>
                <th>Fiili Çalışma Süresi</th>
                <th>Fazla Mesai</th>
                <th>Gece Çalışması</th>
                <th>Bayram</th>
                <th>Ödemeye esas fazla mesai</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{working && working.user.identityNumber}</td>
                <td>
                  {working && working.user.name}{" "}
                  {working && working.user.surname}
                </td>
                {working &&
                  working.dayHour.map((day) => (
                    <td>{day.sabah != 0 ? day.sabah : day.aksam}</td>
                  ))}
                <td>{working && working.activeWorkingTime}</td>
                <td>{working && working.fiili}</td>
                <td>{working && working.fazlaMesai}</td>
                <td>{working && working.geceCalisma}</td>
                <td>{working && working.bayram}</td>
                <td>{working && working.esasOdeme}</td>
              </tr>

              {/* <tr>{working.user.name} {working.user.surname}</tr>
            {working.dayHour.map((day)=>(
              <tr key={day.day}>{day.content}</tr>
            ))} */}
            </tbody>
          </table>
        </div>
        <style jsx>
          {`
            .hidden {
              visibility: hidden;
            }
          `}
        </style>
      </div>
    </>
  );
};
export default WorkingDetail;
