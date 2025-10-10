import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Trade from './pages/Trade';
import Charts from './pages/Charts';
import History from './pages/History';
import Profile from './pages/Profile';
import BottomNav from './components/common/BottomNav';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        
        {/* Protected Routes */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/trade" element={user ? <Trade /> : <Navigate to="/login" />} />
        <Route path="/charts" element={user ? <Charts /> : <Navigate to="/login" />} />
        <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
      
      {user && <BottomNav />}
    </div>
  );
}

export default App;