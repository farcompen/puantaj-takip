import React, { useState, useEffect } from "react";
import UserDataModal from "./modalWithUserData";
import { decodeJwt } from "../utils/jwtDecoder";
import { FaHome } from "react-icons/fa";
import { replace } from "react-router-dom";

const CreateWorkerDetail = () => {
  const [calendarDays, setCalendarDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeWorkingHours, setActiveWorkingHours] = useState(0);
  const [savedWorkingId, setSavedWorkingId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workingId, setWorkingId] = useState("");
  const [selectedUser, setSelectedUser] = useState({});
  const [periodId, setPeriodId] = useState("");
  const [monthlyWorkingDays, setMonthlyWorkingDays] = useState(0);
  const [activeWorkingTime, setActiveWorkingTime] = useState(0);
  const [calendarClassName, setcalendarClassname] = useState(
    "calendar-grid hidden"
  );
  const [period, setPeriod] = useState({});
  const [branchWorkingHours,setBranchWorkingHours]=useState(0);
  const [inputSummaryClassName, setSummaryClassName] =
    useState("input-grid hidden");
  const [selectButtonClassName,setSelectButtonClassName]=useState("btn")
    const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
  const [formData, setFormData] = useState({
    period: "",
    user: "",
    dayHour: [],
    active: true,
    fazlaMesai: "",
    geceCalisma: "",
    bayram: "",
    esasOdeme: "",
    createdUserId: "",
    monthlyWorkingDays: "",
    
  });
const mesaiTypes={
  "normal":1,
  "gece":2
}
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchPeriod();
    fetchUsers();
    generateCalendarDays();
  },[selectedUser]);

  const [workingHours, setWorkingHours] = useState([]);
  const generateCalendarDays = () => {
    // const year = currentMonth.getFullYear();
    // const month = currentMonth.getMonth() - 1;
    // const daysInMonth = new Date(year, month + 1, 0).getDate();
    const month = period.month;
    const year = period.year;
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        sabah:"",
        aksam:""
      });
    }
    console.log(month, year, daysInMonth);
    setCalendarDays(days);
  };

  const handleCalendarHidden = () => {

    setSummaryClassName("input-grid");
    setcalendarClassname("calendar-grid");
  };
  const handleDayChange = (index, value,mesaiType) => {
    const updatedDays = [...calendarDays];
   if(mesaiType==mesaiTypes.normal){
    updatedDays[index].sabah=value;
    
    
   }
   else if(mesaiType==mesaiTypes.gece){
    updatedDays[index].aksam=value;
   }
    setCalendarDays(updatedDays);
  };

  const handleFormData = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const fetchUsers = async () => {
    const {id} =decodeJwt( localStorage.getItem("accessToken"))

    const result = await fetch(`${process.env.REACT_APP_PERSONEL}/${id}`).then((res) =>
      res.json()
    );
    setUsers(result.users);
  };

  const redirectPage=(result)=>{
  setSelectButtonClassName("btn hidden")
    alert(`Bu döneme  [${result.name} / ${result.year}] kullanıcınıza puantaj girişi yapılmamış. Lütfen İSM admin ile görüşünüz `)
  
  }

  const handleUserModal = () => {
    setIsModalOpen(false);
  };
  const calculateActiveWorkingHours = () => {
    let sum = 0;
    calendarDays.map((day) => {
      Number(day.content) ? (sum += Number(day.content)) : (sum += 0);
    });
    setActiveWorkingHours(sum);
    setFormData((prevState) => ({ ...prevState, fiili: sum }));
  };
  const fetchPeriod = async () => {
    
    const result = await fetch(process.env.REACT_APP_PERIOD)
      .then((res) => res.json())
    setPeriod(result.result[0])
    const month = period.month;
    const year = period.year;
    const daysInMonth = new Date(year, month, 0).getDate();
    setFormData((prevState) => ({ ...prevState, period: period._id }));
   // setMonthlyWorkingDays(period.activeWorkingDaysInMonth);
  const {id}=decodeJwt(localStorage.getItem("accessToken"));
  const branchPuantajInfo = result.result[0].detail;
  console.log(branchPuantajInfo)
  const secilen =  branchPuantajInfo.find(item => item.id === id);
  if(secilen==undefined){

  redirectPage(result.result[0])
  }
  setMonthlyWorkingDays(secilen&&secilen.activeWorkingDaysInMonth)
  setBranchWorkingHours(secilen&&secilen.activeHours);
     
  };
  const handleSubmit = async () => {
    initDayHourList();
    console.log("aktif working time calıscak");
    initActiveWorkingTime();
    calculateActiveWorkingHours();
    const {id} = decodeJwt(localStorage.getItem("accessToken"));

    const willPostData = {
      period: formData.period,
      user: formData.user,
      active: true,
      createdUser: id,
      dayHour: calendarDays,
      fiili: activeWorkingHours,
      activeWorkingTime: activeWorkingTime,
      fazlaMesai: formData.fazlaMesai,
      geceCalisma: formData.geceCalisma,
      bayram: formData.bayram,
      esasOdeme: formData.esasOdeme,
      admin:decodeJwt(localStorage.getItem("accessToken")),
      mahsuplasmaValue:0
    };

    const result = await fetch(process.env.REACT_APP_WORKINGS_API_URL, {
      headers: new Headers({
        "content-type": "application/json",
      }),
      body: JSON.stringify(willPostData),
      method: "POST",
    }).then((res) => res.json());
    if (result.status === "success") {
      setSavedWorkingId(result.id);
      setIsModalOpen(true);
    } else {
      alert(result.message);
    }

    console.log("from posting", willPostData);
  };

  const initDayHourList = () => {
    calendarDays.map((day) => {
      formData.dayHour.push(day);
    });
  };

  const initActiveWorkingTime = () => {
    
    console.log(monthlyWorkingDays,branchWorkingHours,activeWorkingTime)
    setActiveWorkingTime(
       monthlyWorkingDays * branchWorkingHours
    );
    console.log("aktive working time calısıtı");
  };
  const handleUser = (user) => {
    setFormData((prevState) => ({ ...prevState, user: user }));
    setSelectedUser(users.find((u) => u._id == user));
  };

  return (
    <div className="calendar-container">
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
             <FaHome/> Puantaj Girişi
            </h2>
          </div>
          <div className="card">
          <div className="input-group">
        <label htmlFor="personnel">Personel Seçiniz</label>
        <select
          id="personnel"
          className="month-dropdown"
          onChange={(e) => handleUser(e.target.value)}
        >
          <option>Seçiniz ..</option>
          {users.map((user, index) => (
            <option key={index} value={user._id}>
              {user.name} {user.surname}
            </option>
          ))}
        </select>
        <button id="sec" className={selectButtonClassName} onClick={handleCalendarHidden}>
          Seç
        </button>
      <div style={{border: "1px solid red", padding: "10px", marginLeft: "10px", display: "inline-block"}}>
        <p>İzin Durumları: izin=i, idari izin= i.i, rapor=r, sevk=s olarak girilmelidir. İzin durumları sadece "sabah" hanesine girilmelidir</p>
      </div>
      </div>
      <h4>
        Dönem:{" "}
        <u>
          {period.month+1}- {period.year} {new Date(period.year,period.month).toLocaleDateString("tr-TR",{month:'long'})}
        </u>
      </h4>

          </div>
      
      
      <div className={calendarClassName}>
        {calendarDays.map((day, index) => (
          <div key={index} className="calendar-day">
            <div className="day-number">
              {day.day} |{" "}
              {new Date(
                period.year,
                period.month,
                day.day
              ).toLocaleDateString("tr-TR", { weekday: "long" })}
            </div>
            <div className="input-row">
            <label>sabah</label>
            <input
              type="text"
              defaultValue={0}
              value={day.content}
              onChange={(e) => handleDayChange(index, e.target.value,1)}
              placeholder="giriniz.."
            />

            </div>
          
            <div className="input-row">
            <label>akşam</label>
             <input
              type="text"
              defaultValue={0}
              value={day.content}
              onChange={(e) => handleDayChange(index, e.target.value,2)}
              placeholder="giriniz."
            />

            </div>
           
          </div>
        ))}
      </div>

      <div className={inputSummaryClassName}>
        <div className="input-field">
          <label>Aylık Çalışma Süresi</label>
          <input
            type="text"
            placeholder=""
            value={monthlyWorkingDays * branchWorkingHours}
          />
        </div>
        <div className="input-field">
          <label>Fiili Çalışma süresi</label>
          <input
            type="text"
            placeholder=""
            name="fiili"
            value={activeWorkingHours}
          />
        </div>
        <div className="input-field">
          <label>Fazla Mesai</label>
          <input
            type="text"
            placeholder=""
            name="fazlaMesai"
            value={formData.fazlaMesai}
            onChange={handleFormData}
          />
        </div>
        <div className="input-field">
          <label>Gece Çalışması</label>
          <input
            name="geceCalisma"
            value={formData.geceCalisma}
            type="text"
            placeholder=""
            onChange={handleFormData}
          />
        </div>
        <div className="input-field">
          <label>Bayram</label>
          <input
            type="text"
            name="bayram"
            value={formData.bayram}
            placeholder=""
            onChange={handleFormData}
          />
        </div>
        <div className="input-field">
          <label>Ödemeye Esas Fazla</label>
          <input
            type="text"
            name="esasOdeme"
            value={formData.esasOdeme}
            placeholder=""
            onChange={handleFormData}
          />
        </div>
        <button onClick={handleSubmit} className="button btn-submit">
          Kaydet
        </button>
      </div>
     

      <UserDataModal
        modalOpen={isModalOpen}
        handleModal={() => handleUserModal()}
        period={formData.period}
        user={selectedUser}
      />

      <style jsx>{`
        .input-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 20px;
        }
        .input-field {
          display: flex;
          flex-direction: column;
        }
         .disabled {
  background-color: dimgrey;
  color: linen;
  opacity: 1;
}

          .input-row{
           display: flex;
          flex-direction: row;
          }
          .input-row label{
          margin-top:15px;
          font-size: x-small;
          font-weight: bold;
          }
          .input-row input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .input-field label {
          margin-bottom: 5px;
          font-size: small;
          font-weight: bold;
        }
        .input-field input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .btn-submit {
          font-weight: normal;

          float: right;
        }
      `}</style>

      <style jsx>{`
        .input-summary {
          margin-top: 20px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .input-row {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }
        .input-row:last-child {
          margin-bottom: 0;
        }
        .input-row input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      `}</style>

      <style jsx>{`
        .calendar-container {
        
          margin-top:0;
        }
        .btn {
          font-weight: normal;
          border-radius: 4px;
        }
        .input-group {
          margin-bottom: 15px;
        }
        .input-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .month-dropdown {
          width: 200px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
          margin-top: 20px;
          border-top: 1px;
        }
        .calendar-day {
          border: 1px solid #ddd;
          padding: 10px;
          min-height: 100px;
        }
        .day-number {
          font-weight: bold;
          margin-bottom: 5px;
        }
        input {
          width: 100%;
          border: 1px solid #eee;
          padding: 5px;
        }
        .hidden {
          visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default CreateWorkerDetail;
