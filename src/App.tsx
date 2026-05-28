import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AuthGuard } from './components/AuthGuard';
import { Toaster } from 'react-hot-toast';

// Pages import
import { Login, Register, ForgotPassword } from './pages/AuthPages';
import { Dashboard } from './pages/Dashboard';
import { Marketplace } from './pages/Marketplace';
import { ProjectDetail } from './pages/ProjectDetail';
import { MyLeads } from './pages/MyLeads';
import { Earnings } from './pages/Earnings';
import { SavedProjects } from './pages/SavedProjects';
import { Leaderboard } from './pages/Leaderboard';
import { ProfileSettings } from './pages/ProfileSettings';
import { AdminPanel } from './pages/AdminPanel';
import { NotificationsPage } from './pages/NotificationsPage';
import { Categories } from './pages/Categories';

export default function App() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-800 selection:bg-blue-105 selection:text-blue-900 leading-normal">
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          duration: 3500, 
          style: { 
            fontSize: '11px', 
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600',
            background: '#0f172a',
            color: '#fff',
            borderRadius: '10px'
          } 
        }} 
      />
      
      <Routes>
        {/* Public authentication flows */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Dashboard Workspace layout */}
        <Route path="/*" element={
          <AuthGuard>
            <div className="flex min-h-screen bg-[#F9FAFB]">
              {/* Left unified sidebar console */}
              <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />
              
              {/* Scrollable center-right viewing area */}
              <div className="flex-1 flex flex-col min-w-0 md:pl-64">
                
                {/* Horizontal Navbar panel */}
                <Navbar setMobileOpen={setMobileSidebarOpen} />
                
                {/* Center view layout viewport */}
                <main className="flex-1 mt-16 p-4 sm:p-6 overflow-y-auto">
                  <div className="max-w-7xl mx-auto space-y-6">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/projects" element={<Marketplace />} />
                      <Route path="/projects/:slug" element={<ProjectDetail />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/leads" element={<MyLeads />} />
                      <Route path="/earnings" element={<Earnings />} />
                      <Route path="/saved" element={<SavedProjects />} />
                      <Route path="/leaderboard" element={<Leaderboard />} />
                      <Route path="/profile" element={<ProfileSettings />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      
                      {/* Admin panel command gateway */}
                      <Route path="/admin" element={
                        <AuthGuard requireAdmin={true}>
                          <AdminPanel />
                        </AuthGuard>
                      } />

                      {/* Clean state rewrite safety checks fallback */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>
          </AuthGuard>
        } />
      </Routes>
    </div>
  );
}
