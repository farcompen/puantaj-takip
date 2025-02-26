import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./styles.css";
import FileIcon from "./FileIcon";
import Papa from "papaparse";
import Data from "./data";
import CreateWorkerDetail from "./components/createWorkerDetail";
import WorkingsView from "./components/workingView";
import Menu from "./components/menu";
import Login from "./components/login/login";
import ProtectedRoute from "./components/route/protectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import AdminViewWorkings from "./components/adminViewWorkings";
import WorkingDetail from "./components/workingDetail";
import ProtectedAdminRoute from "./components/route/adminRoute";
import PuantajOnay from "./components/puantajOnay";
import AddLocationAdmin from "./components/admin/addLocationAdmin";
import Location from "./components/admin/location";
import Personel from "./components/admin/personel";
import Period from "./components/admin/period";
import Mahsuplasma from "./components/admin/mahsuplasma";
import Dashboard from "./components/admin/dashboard";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createMonthlyWorks"
            element={
              <ProtectedRoute>
                <CreateWorkerDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workingsView"
            element={
              <ProtectedRoute>
                <WorkingsView />
              </ProtectedRoute>
            }
          />
           <Route
            path="/workingDetail"
            element={
              <ProtectedRoute>
                <WorkingDetail />
              </ProtectedRoute>
            }
          />
          <Route 
          path="/mahsuplas"
          element={
            <ProtectedRoute>
              <Mahsuplasma/>
            </ProtectedRoute>
          }
          />
          <Route
            path="/adminworkings"
            element={
              <ProtectedAdminRoute>
                <AdminViewWorkings />
              </ProtectedAdminRoute>
            }
          />
          <Route 
          
          path="/period"
          element={
            <ProtectedAdminRoute>
              <Period/>
            </ProtectedAdminRoute>
          }
          />
          <Route 
          path="/personel" element={
            <ProtectedRoute>
              <Personel/>
            </ProtectedRoute>
          }
          />
          <Route
          
          path="/puantajOnay"
          element={
            <ProtectedAdminRoute>
              <PuantajOnay/>
            </ProtectedAdminRoute>
          }
          ></Route>
          <Route path="/addLocationAdmin" element={
            <ProtectedAdminRoute>
            <AddLocationAdmin/>
          </ProtectedAdminRoute>
          }>
          </Route>
          <Route path="/location" element={
            <ProtectedAdminRoute>
            <Location/>
          </ProtectedAdminRoute>
          }></Route>
        
          <Route path="/login" element={<Login />} />
          <Route  path="/main" element={
            <ProtectedRoute>
              <Dashboard />

            </ProtectedRoute>
            }/>
        </Routes>
      </Router>
    </>
  );
}
export default App;
