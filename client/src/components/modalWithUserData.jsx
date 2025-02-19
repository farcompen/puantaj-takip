
import { useEffect, useState } from "react";
import  {FaCheckCircle,FaWindowClose} from "react-icons/fa";
const UserDataModal = ({modalOpen,handleModal,period,user})=>{
    const [isModalOpen,setIsModalOpen]=useState(modalOpen);
    const [checkClassName,setCheckClassName]=useState("hidden")
  const [working,setWorking]=useState({
    dayHour:[],
    user:""
  
  });
  const [formdata,setformdata]=useState({
    mahsuplasilan:0
  })
        useEffect(()=>{
       setIsModalOpen(modalOpen)
        fetchWorking();
        console.log("is modal open",modalOpen)
    },[modalOpen])

   const handleModalState=(state)=>{
    handleModal();
   }

   const handleFormdata=(e)=>{
    const {name,value}=e.target;
    console.log("e is",value)
    setformdata((prev)=>({...prev,[name]:value}))

   }
    const fetchWorking=async()=>{
      const data = {
        userId:user._id,
        periodId:period
      }
      const result = await fetch(`${process.env.REACT_APP_USERWORKING}`,{
        headers:new Headers({
          "content-type":"application/json"}),
          body:JSON.stringify({
            data

          }
          
          ),
          method:'POST'
      }).then(res=>res.json())
      console.log("working is",result)
      setWorking(result.working)
    }
  const checkMahsuplasmaStatus = ()=>{
    return working.user.mahsuplasmaValue>=formdata.mahsuplasilan && formdata.mahsuplasilan<=working.fazlaMesai

  }
    const handleApprove = async()=>{
      if(checkMahsuplasmaStatus){
        const updateResult = await fetch(`${process.env.REACT_APP_WORKINGSBYPERIOD_API_URL}/${working._id}`,{
          method:'PATCH',
          headers:new Headers({
          "content-type":"application/json"
          }),
          body:JSON.stringify({
            localApprove:true
           // mahsuplasmaValue:Number(mahsuplasilan)
          })
        })
                                     .then(res=>res.json());
          if(updateResult.status==="success"){
            handleModalState(false);
            console.log("değiştirildi")
            alert("Puantaj kaydedildi");
            window.location.reload()
          }                       
          else {
            alert("hata",updateResult.message);
            handleModalState(false);
          }    
      }
      else {
        alert("Mahsup edilecek değer personelin toplam mahsuplaşma saatinden büyük olamaz. Mahsup edilecek değer fazla mesai değerinden büyük olamaz")
      }
      

    }
return(
    <div className="modal-overlay" style={{ display: isModalOpen ? 'flex' : 'none' }}>
    <div className="modal">
      <div className="modal-header">
     {`Önizleme | Personel mahsuplaşma saati: ${working.user.mahsuplasmaValue}`}
        
      </div>
      <div className="modal-content">
      <table className="json-table">
          <thead>
            <tr>
              <td>TC NO</td>
              <td>Adı Soyadı</td>
           
           {/* {working??working.map((wrk)=>(
              wrk.dayHour.map((day)=>(
                <td>{day.day}</td>
              ))
            )) } */}
            {working&&working.dayHour.map((day)=>(
                 <td>{day.day}</td>
            ))}
          <td>Aktif Çalışma Süresi</td>
          <td>Fiili Çalışma Süresi</td>
          <td>Fazla Mesai</td>
          <td>Gece Çalışması</td>
          <td>Bayram</td>
          <td>Ödemeye esas fazla mesai</td>
            </tr>
          
          </thead>
          <tbody>
          
            
              <tr>
               
              <td>{working&&working.identityNumber}</td>
              <td>{working&&working.user.name} {working&&working.user.surname}</td>
             {working&&working.dayHour.map((day)=>(
               <td>{  day.sabah!=0?day.sabah:day.aksam}</td>
             ))}
              <td>{working&&working.activeWorkingTime}</td>
              <td>{working&&working.fiili}</td>
              <td>{working&&working.fazlaMesai}</td>
              <td>{working&&working.geceCalisma}</td>
              <td>{working&&working.bayram}</td>
              <td>{working&&working.esasOdeme}</td>
              </tr>

            
            {/* <tr>{working.user.name} {working.user.surname}</tr>
            {working.dayHour.map((day)=>(
              <tr key={day.day}>{day.content}</tr>
            ))} */}
         
          </tbody>
        </table>
     
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
        <button className="btn btn-success" onClick={() => handleApprove()}>Onayla <FaCheckCircle/></button>
        <button className="btn btn-red" onClick={() => handleModalState(false)}>Reddet <FaWindowClose/></button>
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
   
    
)
}
export default UserDataModal;