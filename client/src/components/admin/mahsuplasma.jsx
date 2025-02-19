import { useEffect, useState } from "react";
import { decodeJwt } from "../../utils/jwtDecoder";
import { FaPlusCircle, FaRegPlusSquare } from "react-icons/fa";
const Mahsuplasma = ()=>{
    const [period, setPeriod] = useState([]);
    const [workingList, setWorkingList] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState({});
    const [mahsuplasmaDoneList,setMahsuplasmaDoneList]=useState([])
    const [mahsuplasmaDoneClassName,setmahsuplasmaDoneClassName]=useState("hidden")
    const [trAlertClass,settralertclass]=useState({
        backgroundColor:""
      });
      const [formdata,setdformdata]=useState({
        mahsuplasmaValue:0
      })
    useEffect(()=>{
        fetchPeriod();
       
    },[])
    const fetchPeriod = async () => {
        const result = await fetch(`${process.env.REACT_APP_ALL_PERIOD}`).then(
          (res) => res.json().then((data) => setPeriod(data.result))
        );
      };
      const handlePeriodChange = (e) => {
        const periodValue = JSON.parse(e);
        setSelectedPeriod(periodValue);
      };
      const handleFOrmdata=(e)=>{
        const {name,value} = e.target;
        setdformdata((prev)=>({...prev,[name]:value}))

      }
      const fetchMahsuplasmaYapilanlar = async()=>{
      
       const {id}= decodeJwt(localStorage.getItem("accessToken"));
       
        if(!selectedPeriod._id){
            alert("Dönem seçiniz..")
        }
        else {
            setmahsuplasmaDoneClassName("")
            const result = await fetch(process.env.REACT_APP_MAHSUPASLAMDONE,{
                method:'POST',
                headers:new Headers({
                    "content-type":"application/json"
                }),
                body:JSON.stringify({
                    postBody:{
                        period:selectedPeriod._id,
                        admin:id
                    }
                })
            }).then(res=>res.json())
            setMahsuplasmaDoneList(result.result)
        }
      }
      const fetchWorkingsByCreatedUserId = async () => {
          const token = localStorage.getItem("accessToken");
          const { id } = decodeJwt(token);
          const result = await fetch(
            `${process.env.REACT_APP_MAHSUPLASMA}`,
            {
              method: "POST",
              body: JSON.stringify({
                postBody: {
                  userId: id,
                  periodId: selectedPeriod._id,
                },
              }),
              headers: new Headers({
                "content-type": "application/json",
              }),
            }
          ).then((res) => res.json());
       if(result.status==="success"){
        setWorkingList(result.mahsuplasmaList)
        if(result.mahsuplasmaList.length===0)
            alert("mahsuplaşacak kayıt bulunamadı")

       }
       else {
        alert(result.message)
       }
         ;
        };
        const postMahsuplasma = async(id)=>{
            const result = await fetch(process.env.REACT_APP_POSTMAHSUPLASMA,{
                method:'POST',
                headers:new Headers({
                    "content-type":"application/json"
                }),
                body:JSON.stringify({
                    postBody:{
                        workingId:id,
                        mahsuplasmaValue:formdata.mahsuplasmaValue
                    }
                })
            }).then(res=>res.json());
            if(result.status==="success"){
                alert(result.message)
                fetchWorkingsByCreatedUserId();
               
            }
            else {
                alert(result.message)
            }
        }
    return(
        <>
        <div >
            <div className="card">
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
                <option key={index} value={JSON.stringify(period)}>
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
          <a style={{fontSize:'x-small',float:'right'}} onClick={fetchMahsuplasmaYapilanlar} ><FaRegPlusSquare/><u> Bu döneme ait mahsuplaşanları göster </u></a>
        </div>

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
               Mahsuplaşma Yapılacaklar |{selectedPeriod.name}
            </h2>
          </div>
        <div className="card">
          
          <table
           className="detail-table scrool"
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
                <th>Mahsuplaşabilecek</th>
                <th>Mahsuplaşan</th>
                <th>Gece Çalışması</th>
                <th>Bayram</th>
                <th>Ödemeye esas fazla mesai</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            
                {workingList.map((working)=>(
                    <tr style={trAlertClass}>
                      
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
                {working&&working.fazlaMesai>0?(
                    <td style={{backgroundColor:'red'}}>{working.fazlaMesai}</td>
                ):<td>{working.fazlaMesai}</td>}
                
                                  <td>{working&&working.user.mahsuplasmaValue}</td>
               
               {
               working&&working.mahsuplasmaValue>0?
               (
               <td style={{backgroundColor:'yellow'}}>{working&&working.mahsuplasmaValue}
               </td>):
               (<td>
                0
               </td>)

              }
                <td>{working && working.geceCalisma}</td>
                <td>{working && working.bayram}</td>
                {
                 working&&working.fazlaMesai>0?(
                    <td style={{backgroundColor:'red'}}>{working.fazlaMesai}</td>
                ):<td>{working.fazlaMesai}</td>}
                
                  <td>
                    <div className="button-grid">
                    <input type="number"  name="mahsuplasmaValue" id="mahsuplasmaValue" value={FormData.mahsuplasmaValue} onChange={handleFOrmdata} />
                    <button className="btn btn-success" onClick={()=>postMahsuplasma(working._id)}>Mahsuplaş</button>
                    </div>
                 
                  
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

        <div  className={mahsuplasmaDoneClassName}>
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
              Dönemde Mahsuplaşma yapılanlar |{selectedPeriod.name}
            </h2>
          </div>
          <div className="card">
          
          <table
           className="detail-table scrool "
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
                {mahsuplasmaDoneList[0] && mahsuplasmaDoneList[0].dayHour.map((day) => <th>{day.day}</th>)}
                <th>Aktif Çalışma Süresi</th>
                <th>Fiili Çalışma Süresi</th>
                <th>Fazla Mesai</th>
                <th>Mahsuplaşabilecek</th>
                <th>Mahsuplaşan</th>
                <th>Gece Çalışması</th>
                <th>Bayram</th>
                <th>Ödemeye esas fazla mesai</th>
               
              </tr>
            </thead>
            <tbody>
            
                {mahsuplasmaDoneList.map((working)=>(
                    <tr style={trAlertClass}>
                      
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
                {working&&working.fazlaMesai>0?(
                    <td style={{backgroundColor:'red'}}>{working.fazlaMesai}</td>
                ):<td>{working.fazlaMesai}</td>}
                
                                  <td>{working&&working.user.mahsuplasmaValue}</td>
               
               {
               working&&working.mahsuplasmaValue>0?
               (
               <td style={{backgroundColor:'yellow'}}>{working&&working.mahsuplasmaValue}
               </td>):
               (<td>
                0
               </td>)

              }
                <td>{working && working.geceCalisma}</td>
                <td>{working && working.bayram}</td>
                {
                 working&&working.fazlaMesai>0?(
                    <td style={{backgroundColor:'red'}}>{working.fazlaMesai}</td>
                ):<td>{working.fazlaMesai}</td>}
                
                 
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
        
       
        <style jsx>
          {`
            .hidden {
              visibility: hidden;
            }
          `}
        </style>
            
        </div>
     
    
        </>
    )
}

export default Mahsuplasma;