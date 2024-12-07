import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Search, Plus, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getQRCodes } from '../lib/supabase';

interface QRCode {
  id: string;
  type: string;
  content: string;
  created_at: string;
  scans: number;
  last_scan: string | null;
}

export default function MyQRCodes() {
  const { user } = useAuth();
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchQRCodes = async () => {
      if (!user?.id) return;

      try {
        const codes = await getQRCodes(user.id);
        setQrCodes(codes);
      } catch (error) {
        console.error('Error fetching QR codes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCodes();
  }, [user]);

  const filteredQRCodes = qrCodes.filter(code => 
    code.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Active QR Codes ({filteredQRCodes.length} Dynamic codes)
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search QR Codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              CREATE QR CODE
            </Link>
          </div>
        </div>

        {filteredQRCodes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <QrCode className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No QR codes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first QR code
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create QR Code
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            {filteredQRCodes.map((qrCode) => (
              <div key={qrCode.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-6 flex-1">
                  <div className="flex-shrink-0">
                    <img
                      src={`/qr/${qrCode.id}`}
                      alt="QR Code"
                      className="w-24 h-24"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-5 w-5 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">
                        {qrCode.type.charAt(0).toUpperCase() + qrCode.type.slice(1)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 truncate">
                      {qrCode.content}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Created on {new Date(qrCode.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-gray-900">
                      {qrCode.scans}
                    </p>
                    <p className="text-xs text-gray-500">Scans</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/analytics/${qrCode.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Details →
                    </Link>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}