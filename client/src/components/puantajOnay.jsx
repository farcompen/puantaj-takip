import { useEffect, useState } from "react";
import { FaCheckCircle, FaListAlt, FaHome,FaRegFileExcel } from "react-icons/fa";
import PuantajRedModal from "./puantajRedModal";
const PuantajOnay=()=>{
    const [userList, setUserList] = useState([]);
    const [period, setPeriod] = useState([]);
    const [selectedPeriod,setSelectedPeriod]=useState({
        name:"",
        id:""
    });
    const [workingList,setWorkingList]=useState([]);
    const [tableClass,setTableClass]=useState("detail-table")
    const [rejectionReason,setRejectionReason]=useState("");
    const [selectedAdmin,setSelectedAdmin]=useState("");
    // useEffect(()=>{
    //     fetchLocationUsers();
    // },[])
    useEffect(() => {
        fetchPeriod();
        console.log(selectedPeriod)
      }, []);
      const fetchPeriod = async () => {
        const result = await fetch(`${process.env.REACT_APP_ALL_PERIOD}`).then(
          (res) => res.json().then((data) => setPeriod(data.result))
        );
      };
    const fetchLocationUsers = async()=>{
        const users = await fetch(process.env.REACT_APP_LOCATION_USERS)
                      .then(res=>res.json())
        setUserList(users.result);
        console.log(selectedPeriod)
    }
    const handlePeriodChange = (e) => {
console.log(e);
        const fullPeriod = e.target.value.split("-")
        const periodName=fullPeriod[1];
        const id = fullPeriod[0];
        console.log(fullPeriod)
        setSelectedPeriod({name:periodName,id:id});
      };

      const fetchLocatioAdminWorkings = async(userId,periodId)=>{

        const result = await fetch(process.env.REACT_APP_TESISADMINWORKINGLIST,{
            method:'POST',
            headers:new Headers({
                "content-type":"application/json"
            }),
            body:JSON.stringify({
               postBody:{
                userId:userId,
                periodId:periodId
               }
            })
        }).then(res=>res.json())
        setTableClass("detail-table scrool")
        setWorkingList(result.workingList)
        setSelectedAdmin(userId);

      }
      const handleRejection =async (e)=>{
        setRejectionReason(e)
       

      }
    const submitRejection = async(id)=>{
        const updateResult = await fetch(`${process.env.REACT_APP_WORKINGSBYPERIOD_API_URL}/${id}`,{
            method:'PATCH',
            headers:new Headers({
            "content-type":"application/json"
            }),
            body:JSON.stringify({
              status:2,
              detail:"Reddedildi " + rejectionReason
            })
          }).then(res=>res.json())
          if(updateResult.status==="success"){
           await fetchLocatioAdminWorkings(selectedAdmin,selectedPeriod.id);

          }else {
            alert(updateResult.message)
          }
    }
      const handleApprove = async(id)=>{
        const updateResult = await fetch(`${process.env.REACT_APP_WORKINGSBYPERIOD_API_URL}/${id}`,{
          method:'PATCH',
          headers:new Headers({
          "content-type":"application/json"
          }),
          body:JSON.stringify({
            adminApprove:true,
            detail:"Onaylandı"
          })
        }).then(res=>res.json());
      
        if(updateResult.status==="success"){
            await fetchLocatioAdminWorkings(selectedAdmin,selectedPeriod.id);
        }
        else {
            alert(updateResult.message)
          }
    }
    return(
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
                                           fontSize: "small",
                                           color: "#333",
                                           fontWeight: "500",
                                           fontWeight: "bold",
                                         }}
                                       >
                                        <FaHome/> Puantaj Onay
                                       </h2>
                                     </div>
           <div className="card"
           style={{
                 
                  
                  
                  
             maxWidth:"83vw",
            width:"83vw",
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
                <option key={index} value={`${period._id}-${period.year}/${period.month+1}`}>
                  {period.month + 1} - {period.year}
                </option>
              ))}
          </select>
          <button
            id="sec"
            className="btn"
            onClick={fetchLocationUsers}
          >
            Listele
          </button>
        </div>

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
                       fontSize: "small",
                       color: "#333",
                       fontWeight: "500",
                       fontWeight: "bold",
                     }}
                   >
                     Kurum Veri Sorumlu Listesi
                   </h2>
                 </div>
         <div
                 
                 className="card"
                 style={{
                 
                  
                  
                      maxWidth:"83vw",
            width:"83vw",
                   backgroundColor: "#fff",
                   borderRadius: "8px",
                   boxShadow: "0 8px 8px rgba(0,0,0,0.1)",
                   padding: "10px",
                   marginBottom: "10px",
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
                        Kurumu
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
                         
                       ></th>
                     </tr>
                   </thead>
                   <tbody >
                     {userList &&
                       userList.map((data, index) => (
                         <tr>
                           <td >
                             1
                           </td>
                           <td >
                             {data.identityNumber}
                           </td>
                           <td >
                             {data.name} {data.surname}
                           </td>
       
                           <td >
                             {data.location.name}
                           </td>
                           <td >
                             {""}
                           </td>
                          
                          
                          <td>
                         {selectedPeriod.name}
                          </td>
       
                           <td  >
                            
                             <button
                               
                               onClick={()=>fetchLocatioAdminWorkings(data._id,selectedPeriod.id)}
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
                fontSize: "small",
                color: "#333",
                fontWeight: "500",
                fontWeight: "bold",
              }}
            >
              Personel Puantaj Tablosu
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
          maxWidth:"83vw",
            width:"83vw"
          }}
        >
         
          <table
           className={tableClass}
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
                {workingList[0] && workingList[0].dayHour.map((day) => <th>{day.day}</th>)}
                <th>Aktif Çalışma Süresi</th>
                <th>Fiili Çalışma Süresi</th>
                <th>Fazla Mesai</th>
                <th>Gece Çalışması</th>
                <th>Bayram</th>
                <th>Ödemeye esas fazla mesai</th>
             <th></th>
             <th>Puantaj reddedildiyse</th>
              </tr>
            </thead>
            <tbody>
                {workingList.map((work)=>(
                    <tr>
                        <td>{work&&work.user.identityNumber}</td>
                        <td>{work&&work.user.name} {work&&work.user.surname}</td>
                        
                        {work &&
                  work.dayHour.map((day) => (
                    <td>{day.sabah != 0 ? day.sabah : day.aksam}</td>
                  ))}
<td>{work && work.activeWorkingTime}</td>
                <td>{work && work.fiili}</td>
                <td>{work && work.fiili-work.activeWorkingTime}</td>
                <td>{work&& work.geceCalisma}</td>
                <td>{work && work.bayram}</td>
                <td>{work && work.fiili-work.activeWorkingTime}</td>
                <td>
                    
                    <div className="button-grid" >
                      {
                        work&&work.status==2?(<div>{work.detail}</div>):
                        (
                        work&&work.adminApprove?(<div>İSM onaylı</div>):(<>
                        <button className="btn-success small-button"  onClick={()=>handleApprove(work._id)}> Onay</button>
                        <button className="error small-button"  onClick={()=>submitRejection(work._id)}> Red</button>
                        </>
                        ))
                      }
                    
                    </div>
                   </td>
                  <td >
                    <textarea   onChange={(e)=>handleRejection(e.target.value)} placeholder="red gerekçesi giriniz"></textarea>
                  </td>
                 
                    </tr>
                ))}
              
              {/* <tr>{working.user.name} {working.user.surname}</tr>
            {working.dayHour.map((day)=>(
              <tr key={day.day}>{day.content}</tr>
            ))} */}
            </tbody>
          </table>
        </div>
       
               </div>
        </>

    )

}
export default PuantajOnay;