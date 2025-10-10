import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ title }) => {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.fullName}</p>
          </div>
          {user?.kycVerified && (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
              KYC Verified
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;