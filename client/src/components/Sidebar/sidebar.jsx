import React from 'react';
import {FaPencilAlt,FaClipboardList,FaSearch, FaRegUser, FaRegTimesCircle} from "react-icons/fa"
const Sidebar = () => {
  return (
    <>
     <div className="sidebar">
      <a href="/createMonthlyWorks" className="sidebar-link"><FaPencilAlt/> Puantaj Girişi</a>
      <a href="/workingDetail" className="sidebar-link"><FaSearch/>  Puantaj Takip</a>
      <a href="/workingsView" className="sidebar-link"><FaClipboardList/> Puantaj Döküm</a>
     <a href ="/personel" className='sidebar-link'> <FaRegUser /> Personel İşlemleri</a>
     
    </div>
    <div>asdsad</div>
    </>
   
    
  );
};

export default Sidebar;