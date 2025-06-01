import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AgencyManagement from '../pages/admin/AgencyManagement';
import VehicleManagement from '../pages/admin/VehicleManagement';
import EmployeeManagement from '../pages/admin/EmployeeManagement';
// import AdminDashboard from '../pages/admin/AdminDashboard'; // décommenter si dashboard

const AdminRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="" element={<AdminLayout />}>
                {/* Redirection par défaut vers agences */}
                <Route index element={<Navigate to="agencies" replace />} />
                {/* <Route path="dashboard" element={<AdminDashboard />} /> */}
                <Route path="agencies" element={<AgencyManagement />} />
                <Route path="vehicles" element={<VehicleManagement />} />
                <Route path="employees" element={<EmployeeManagement />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
