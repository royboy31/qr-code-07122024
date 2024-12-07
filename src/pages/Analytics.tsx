import React, { useEffect, useState } from 'react';
import { BarChart as BarChartIcon, Activity, Globe, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';

interface AnalyticsData {
  totalScans: number;
  scansByDate: { date: string; scans: number }[];
  activeQRCodes: number;
}

export default function Analytics() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalScans: 0,
    scansByDate: [],
    activeQRCodes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        // Get all QR codes for the user
        const { data: qrCodes, error: qrError } = await supabase
          .from('qr_codes')
          .select('id, scans')
          .eq('user_id', user.id);

        if (qrError) throw qrError;

        // Get scan data
        const { data: scanData, error: scanError } = await supabase
          .from('scan_data')
          .select('timestamp')
          .in('qr_code_id', qrCodes?.map(code => code.id) || []);

        if (scanError) throw scanError;

        // Calculate total scans
        const totalScans = qrCodes?.reduce((sum, code) => sum + (code.scans || 0), 0) || 0;

        // Process scan data by date
        const scansByDate = new Map<string, number>();
        scanData?.forEach((scan) => {
          const date = new Date(scan.timestamp).toLocaleDateString();
          scansByDate.set(date, (scansByDate.get(date) || 0) + 1);
        });

        // Convert scansByDate map to array for chart
        const chartData = Array.from(scansByDate.entries())
          .map(([date, scans]) => ({
            date,
            scans
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setAnalyticsData({
          totalScans,
          scansByDate: chartData,
          activeQRCodes: qrCodes?.length || 0
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Scans</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData.totalScans}
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
                {analyticsData.scansByDate.find(
                  (data) => data.date === new Date().toLocaleDateString()
                )?.scans || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active QR Codes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analyticsData.activeQRCodes}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Scans Over Time</h2>
        {analyticsData.scansByDate.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.scansByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="scans" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No scan data available yet
          </div>
        )}
      </div>
    </div>
  );
}