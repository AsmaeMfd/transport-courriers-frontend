import React, { useEffect, useState } from 'react';
import StatsCard from '../../components/ui/StatsCard';
import agencyService from '../../services/agencyService';
import employeeService from '../../services/employeeService';
import vehicleService from '../../services/vehicleService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Composant pour les icônes
const AgencyIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const EmployeeIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const VehicleIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

// Dashboard admin : vue d'ensemble des stats principales
const DashboardPage: React.FC = () => {
  // États pour les stats
  const [agencyCount, setAgencyCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement des stats au montage
  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [agencies, employees, vehicles] = await Promise.all([
          agencyService.getAllAgencies(),
          employeeService.getAllEmployees(),
          vehicleService.getAllVehicles()
        ]);
        setAgencyCount(agencies.length);
        setEmployeeCount(employees.length);
        setVehicleCount(vehicles.length);
      } catch (err) {
        setError('Failed to load dashboard statistics. Please try again.');
        console.error('Error loading dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Agencies" 
          value={agencyCount} 
          icon={<AgencyIcon />} 
          description="Total number of agencies"
        />
        <StatsCard 
          title="Employees" 
          value={employeeCount} 
          icon={<EmployeeIcon />} 
          description="Total number of employees"
        />
        <StatsCard 
          title="Vehicles" 
          value={vehicleCount} 
          icon={<VehicleIcon />} 
          description="Total number of vehicles"
        />
      </div>
    </div>
  );
};

export default DashboardPage; 