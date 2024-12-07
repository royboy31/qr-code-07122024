import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Globe, Clock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getQRCode } from '../lib/supabase';

interface ScanData {
  timestamp: string;
  user_agent: string;
  platform: string;
  language: string;
  screen_resolution: string;
}

interface QRCodeData {
  id: string;
  type: string;
  content: string;
  created_at: string;
  scans: number;
  last_scan: string | null;
  scan_data: ScanData[];
}

export default function QRCodeAnalytics() {
  const { id } = useParams();
  const { user } = useAuth();
  const [qrCode, setQRCode] = useState<QRCodeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQRCode = async () => {
      if (!id) return;

      try {
        const data = await getQRCode(id);
        setQRCode(data);
      } catch (error) {
        console.error('Error fetching QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!qrCode) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">QR Code not found</h2>
        <Link
          to="/my-qrcodes"
          className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My QR Codes
        </Link>
      </div>
    );
  }

  const scansByDate = qrCode.scan_data.reduce((acc, scan) => {
    const date = new Date(scan.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(scansByDate).map(([date, scans]) => ({
    date,
    scans
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/my-qrcodes"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            QR Code Analytics
          </h1>
        </div>
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
          {qrCode.type.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Scans</p>
              <p className="text-2xl font-semibold text-gray-900">
                {qrCode.scans}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Globe className="h-6 w-6 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Scans</p>
              <p className="text-2xl font-semibold text-gray-900">
                {scansByDate[new Date().toLocaleDateString()] || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Scan</p>
              <p className="text-2xl font-semibold text-gray-900">
                {qrCode.last_scan
                  ? new Date(qrCode.last_scan).toLocaleDateString()
                  : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Scans Over Time</h2>
        <div className="h-64">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="scans" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No scan data available yet
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Scans</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {qrCode.scan_data.length > 0 ? (
            qrCode.scan_data.slice(0, 10).map((scan, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(scan.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">{scan.platform}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {scan.screen_resolution}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              No scan data available yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}