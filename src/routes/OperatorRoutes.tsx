import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import OperatorLayout from '../layouts/OperatorLayout';
import CourrierManagement from '../pages/operator/CourrierManagement';
import DeliveryManagement from '../pages/operator/DeliveryManagement';
import InvoiceManagement from '../pages/operator/InvoiceManagement';

const OperatorRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="" element={<OperatorLayout />}>
                <Route index element={<Navigate to="courriers" replace />} />
                <Route path="courriers" element={<CourrierManagement />} />
                <Route path="livraisons" element={<DeliveryManagement />} />
                <Route path="factures" element={<InvoiceManagement />} />
            </Route>
        </Routes>
    );
};

export default OperatorRoutes;

