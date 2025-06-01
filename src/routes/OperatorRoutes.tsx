import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OperatorDashboard from '../pages/operator/OperatorDashboard';
import CourierManagement from '../pages/operator/CourierManagement';
import DeliveryTracking from '../pages/operator/DeliveryTracking';

const OperatorRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<OperatorDashboard />} />
            <Route path="/couriers" element={<CourierManagement />} />
            <Route path="/tracking" element={<DeliveryTracking />} />
        </Routes>
    );
};

export default OperatorRoutes;
