import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import QRCodeGenerator from './components/QRCodeGenerator';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';
import RedirectPage from './pages/RedirectPage';
import MyQRCodes from './pages/MyQRCodes';
import QRCodeAnalytics from './pages/QRCodeAnalytics';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
          <Navigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Routes>
              <Route path="/" element={<QRCodeGenerator />} />
              <Route path="/qr/:id" element={<RedirectPage />} />
              <Route
                path="/my-qrcodes"
                element={
                  <PrivateRoute>
                    <MyQRCodes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/analytics/:id"
                element={
                  <PrivateRoute>
                    <QRCodeAnalytics />
                  </PrivateRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <PrivateRoute>
                    <Analytics />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}