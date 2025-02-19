import React from 'react';
import {FaPencilAlt,FaClipboardList,FaSearch, FaRegUser, FaRegTimesCircle, FaPaypal, FaMoneyBill, FaHandsHelping} from "react-icons/fa"
const Sidebar = () => {
  return (
    <>
     <div className="sidebar">
      <a href="/createMonthlyWorks" className="sidebar-link"><FaPencilAlt/> Puantaj Girişi</a>
      <a  href='/mahsuplas' className='sidebar-link'>< FaHandsHelping/> Mahsuplaşma</a>
      <a href="/workingDetail" className="sidebar-link"><FaSearch/>  Puantaj Takip</a>
   
      <a href="/workingsView" className="sidebar-link"><FaClipboardList/> Puantaj Döküm</a>
     <a href ="/personel" className='sidebar-link'> <FaRegUser /> Personel İşlemleri</a>
     
    </div>
    <div>asdsad</div>
    </>
   
    
  );
};

export default Sidebar;