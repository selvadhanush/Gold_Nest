import React, { useState } from 'react';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Shield, LogOut, Bell, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="pb-20">
      <Header title="Profile & Settings" />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Profile Header */}
        <Card className="text-center">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
            {user?.fullName?.charAt(0)?.toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{user?.fullName}</h2>
          <p className="text-gray-600">{user?.email}</p>
          {user?.kycVerified && (
            <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mt-3">
              ✓ KYC Verified
            </div>
          )}
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-lg p-2 shadow-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'profile' ? 'bg-primary text-white' : 'text-gray-600'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('kyc')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'kyc' ? 'bg-primary text-white' : 'text-gray-600'
            }`}
          >
            KYC
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-primary text-white' : 'text-gray-600'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-3">
            <Card>
              <h3 className="font-semibold text-gray-800 mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b">
                  <User className="text-gray-400" size={20} />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Full Name</div>
                    <div className="font-medium text-gray-800">{user?.fullName}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-3 border-b">
                  <Mail className="text-gray-400" size={20} />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Email Address</div>
                    <div className="font-medium text-gray-800">{user?.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-3 border-b">
                  <Phone className="text-gray-400" size={20} />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Phone Number</div>
                    <div className="font-medium text-gray-800">
                      {user?.phoneNumber || 'Not provided'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="text-gray-400" size={20} />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Account Status</div>
                    <div className={`font-medium ${user?.kycVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                      {user?.kycVerified ? 'Verified' : 'Unverified'}
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 py-3 border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Edit Profile
              </button>
            </Card>
          </div>
        )}

        {/* KYC Tab */}
        {activeTab === 'kyc' && (
          <Card>
            <h3 className="font-semibold text-gray-800 mb-4">KYC Verification</h3>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                user?.kycVerified ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">KYC Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    user?.kycVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.kycStatus || 'Pending'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {user?.kycVerified 
                    ? 'Your account is fully verified. You can trade without restrictions.' 
                    : 'Complete your KYC verification to unlock full trading capabilities.'}
                </p>
              </div>

              {!user?.kycVerified && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">1</div>
                      <span className="text-gray-700">Upload ID Proof (Aadhaar/PAN Card)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">2</div>
                      <span className="text-gray-700">Upload Address Proof</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">3</div>
                      <span className="text-gray-700">Wait for verification (24-48 hours)</span>
                    </div>
                  </div>

                  <Button fullWidth variant="primary">
                    Upload Documents
                  </Button>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-3">
            <Card>
              <h3 className="font-semibold text-gray-800 mb-4">App Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <Bell className="text-gray-400" size={20} />
                    <div>
                      <div className="font-medium text-gray-800">Notifications</div>
                      <div className="text-sm text-gray-500">Price alerts & updates</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <Lock className="text-gray-400" size={20} />
                    <div>
                      <div className="font-medium text-gray-800">Biometric Login</div>
                      <div className="text-sm text-gray-500">Use fingerprint/face ID</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-800 mb-4">Account Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full py-3 border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Change Password
                </button>
                
                <Button 
                  fullWidth 
                  variant="danger"
                  icon={LogOut}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </Card>

            <Card className="bg-gray-50">
              <div className="text-center text-sm text-gray-600">
                <p>App Version: 1.0.0</p>
                <p className="mt-2">© 2024 Metals Trading Platform</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;