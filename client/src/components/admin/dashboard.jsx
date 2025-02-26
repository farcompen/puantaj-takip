import { useState, useEffect } from 'react';
import { decodeJwt } from '../../utils/jwtDecoder';

const Dashboard = () => {
  const [workingData, setWorkingData] = useState({
    users:0,
        puantajTotal:0,
        onaylanmayan:0,
        mahsuplasmaYapilan:0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { id } = decodeJwt(localStorage.getItem("accessToken"));
      const response = await fetch(`${process.env.REACT_APP_DASHBOARD}/${id}`);
      const data = await response.json();
      setWorkingData(data.result);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Yönetici Paneli</h1>
      
      <div className="stats-grid">
        
        <div className="stat-card">
          <h3>Toplam Puantaj</h3>
          <p>{workingData.puantajTotal}</p>
        </div>

        <div className="stat-card">
          <h3>Onay Bekleyen</h3>
          <p>{workingData.onaylanmayan}</p>
        </div>
        <div className="stat-card">
          <h3>Toplam Personel</h3>
          <p>{workingData.users}</p>
        </div>

      </div>
    
      <div className="chart-container">
      <h5>Puantaj</h5>
        <div className="pie-chart">

          <div className="pie" style={{
            background: `conic-gradient(
              #FFFF00 0% 9%, 
              #60A5FA 8% 100%
            )`
          }}></div>
          <div className="legend">
            <div className="legend-item">
              <span className="color-box" style={{backgroundColor:'yellow'}}></span>
              <span>Onay Bekleyen ({workingData.onaylanmayan})</span>
            </div>
            <div className="legend-item">
              <span className="color-box" style={{backgroundColor: '#60A5FA'}}></span>
              <span>Onaylanmış ({workingData.puantajTotal - workingData.onaylanmayan})</span>
            </div>
          </div>
        </div>
        <h5>Mahsuplaşma</h5>
        <div className="pie-chart">
          
          <div className="pie" style={{
            background: `conic-gradient(
              #FF0000 0% 9%, 
             #FFFF00 8% 100%
            )`
          }}></div>
          <div className="legend">
            <div className="legend-item">
              <span className="color-box" style={{backgroundColor:'red'}}></span>
              <span>Mahsuplaşma yapılan({workingData.mahsuplasmaYapilan})</span>
            </div>
           
          </div>
        </div>
      </div>

      <style jsx>{`
        .chart-container {
          margin-top: 40px;
          display: flex;
          justify-content: center;
          margin-left:6px;
        }

        .pie-chart {
          display: flex;
          align-items: center;
          gap: 40px;
          margin-left:4px;
        }

        .pie {
          width: 200px;
          height: 200px;
          border-radius: 50%;
        }

        .legend {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .color-box {
          width: 20px;
          height: 20px;
          border-radius: 4px;
        }
      `}</style>

      <style jsx>{`
        .dashboard-container {
          padding: 20px;
        }

        .stats-grid {
          display: flex;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .stat-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }

        .stat-card h3 {
          margin: 0;
          color: #666;
          font-size: 1.1rem;
        }

        .stat-card p {
          margin: 10px 0 0;
          font-size: 2rem;
          font-weight: bold;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
