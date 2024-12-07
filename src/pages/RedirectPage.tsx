import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQRCode, recordScan } from '../lib/supabase';

export default function RedirectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirect = async () => {
      if (!id) {
        navigate('/404');
        return;
      }

      try {
        // Get QR code data
        const qrCode = await getQRCode(id);
        
        if (!qrCode) {
          navigate('/404');
          return;
        }

        // Record the scan
        await recordScan(id);

        // Handle different QR code types
        let redirectUrl = qrCode.content;
        
        switch (qrCode.type) {
          case 'url':
            // Ensure URL has protocol
            redirectUrl = redirectUrl.startsWith('http') 
              ? redirectUrl 
              : `https://${redirectUrl}`;
            window.location.href = redirectUrl;
            break;
          
          case 'email':
          case 'sms':
          case 'wifi':
            // These protocols are handled natively by the browser/device
            window.location.href = redirectUrl;
            break;
          
          case 'vcard':
            // For vCard, create and download a .vcf file
            const blob = new Blob([redirectUrl], { type: 'text/vcard' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'contact.vcf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            break;
          
          case 'text':
            // For text, show it on the page
            setError(null);
            document.body.innerHTML = `
              <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
                  <pre class="whitespace-pre-wrap break-words text-gray-800">${
                    redirectUrl
                  }</pre>
                </div>
              </div>
            `;
            break;
          
          default:
            navigate('/404');
        }
      } catch (error) {
        console.error('Error processing QR code:', error);
        navigate('/404');
      }
    };

    redirect();
  }, [id, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}