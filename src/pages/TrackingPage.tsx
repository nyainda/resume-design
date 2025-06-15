
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, MapPin, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PDFGenerator } from '@/components/PDFGenerator';

interface TrackingData {
  id: string;
  recipient_email: string;
  subject: string;
  sent_at: string | null;
  opened_at?: string | null;
  downloaded_at?: string | null;
  status: string | null;
  tracking_url: string;
  location?: string | null;
  device?: string | null;
  resume_data?: any;
  sender_name?: string;
}

const TrackingPage: React.FC = () => {
  const { trackingId } = useParams();
  const [searchParams] = useSearchParams();
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<string>('');

  useEffect(() => {
    if (trackingId) {
      recordView();
      getUserLocation();
    }
  }, [trackingId]);

  const getUserLocation = async () => {
    try {
      // Get user's approximate location using IP geolocation
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const location = `${data.city}, ${data.country_name}`;
      setUserLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
      setUserLocation('Unknown');
    }
  };

  const recordView = async () => {
    try {
      // First, get the tracking record
      const { data: tracking, error: fetchError } = await supabase
        .from('resume_tracking')
        .select('*')
        .eq('id', trackingId)
        .single();

      if (fetchError) throw fetchError;
      setTrackingData(tracking);

      // Update the tracking record with view information
      const updateData: any = {
        status: 'opened',
        opened_at: new Date().toISOString()
      };

      if (userLocation) {
        updateData.location = userLocation;
      }

      // Get device info
      const userAgent = navigator.userAgent;
      const device = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'Mobile' : 'Desktop';
      updateData.device = device;

      const { error: updateError } = await supabase
        .from('resume_tracking')
        .update(updateData)
        .eq('id', trackingId);

      if (updateError) throw updateError;

      console.log('View recorded successfully');
    } catch (error) {
      console.error('Error recording view:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!trackingData) return;

    try {
      // Update tracking record to show download
      const { error } = await supabase
        .from('resume_tracking')
        .update({
          status: 'downloaded',
          downloaded_at: new Date().toISOString()
        })
        .eq('id', trackingId);

      if (error) throw error;

      // Generate and download the resume PDF using the stored resume data
      if (trackingData.resume_data) {
        const filename = `${trackingData.sender_name?.replace(/\s+/g, '_') || 'Resume'}.pdf`;
        await PDFGenerator.generateTextPDF(trackingData.resume_data, 0, filename);
        toast.success('Resume downloaded successfully!');
      } else {
        toast.error('Resume data not available for download');
      }

    } catch (error) {
      console.error('Error tracking download:', error);
      toast.error('Error downloading resume');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Tracking Link Not Found</h2>
            <p className="text-gray-600">This tracking link may have expired or is invalid.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Resume Viewed Successfully</CardTitle>
            <p className="text-gray-600">
              Thank you for viewing this resume. The applicant has been notified.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Resume Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Application Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subject:</span>
                  <span>{trackingData.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sent to:</span>
                  <span>{trackingData.recipient_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{trackingData.sent_at ? new Date(trackingData.sent_at).toLocaleDateString() : 'Unknown'}</span>
                </div>
              </div>
            </div>

            {/* Download Section */}
            <div className="text-center space-y-4">
              <h3 className="font-semibold">Download Resume</h3>
              <p className="text-sm text-gray-600">
                Click the button below to download the full resume in PDF format.
              </p>
              <Button 
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Resume PDF
              </Button>
            </div>

            {/* Tracking Info */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Viewed: {new Date().toLocaleTimeString()}</span>
                </div>
                {userLocation && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{userLocation}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex justify-center space-x-8 pt-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs text-gray-600">Sent</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs text-gray-600">Viewed</span>
              </div>
              <div className="text-center">
                <div className={`w-8 h-8 ${trackingData.status === 'downloaded' ? 'bg-green-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <Download className={`w-5 h-5 ${trackingData.status === 'downloaded' ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <span className="text-xs text-gray-600">Download</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card>
          <CardContent className="text-center py-6">
            <h4 className="font-medium mb-2">Privacy Notice</h4>
            <p className="text-sm text-gray-600">
              This tracking helps the applicant understand engagement with their resume. 
              No personal information is collected beyond basic analytics.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackingPage;
