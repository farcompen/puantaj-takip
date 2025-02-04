import React from 'react';
import { FaAddressCard,FaClock, FaBuilding,FaCheckCircle,FaRegUser } from 'react-icons/fa';
const AdminSidebar = () => {
  return (
    <div className="sidebar">
     
      <a href="/adminworkings" className="sidebar-link"><FaAddressCard/> Puantaj İzleme</a>
      <a href="/puantajOnay" className="sidebar-link"><FaCheckCircle /> Puantaj Onaylama</a>
      <a href="/addLocationAdmin" className="sidebar-link"><FaRegUser/> Veri Giriş Yetkilisi Kayıt</a>
      <a href="/location" className="sidebar-link"><FaBuilding/> Kurum Kayıt</a>
      <a href ="/period" className='sidebar-link'> <FaClock/> Dönem Açma</a>
    </div>
  );
};

export default AdminSidebar;