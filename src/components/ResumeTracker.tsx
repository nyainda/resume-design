
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Eye, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Send,
  TrendingUp,
  MapPin,
  Calendar,
  ExternalLink,
  Copy,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ResumeTrackingProps {
  resumeData: any;
  onClose: () => void;
}

interface TrackingData {
  id: string;
  recipient_email: string;
  recipient_name?: string | null;
  subject: string;
  sent_at: string | null;
  opened_at?: string | null;
  downloaded_at?: string | null;
  status: string | null;
  tracking_url: string;
  location?: string | null;
  device?: string | null;
  company_name?: string | null;
  job_title?: string | null;
}

const ResumeTracker: React.FC<ResumeTrackingProps> = ({ resumeData, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('send');
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Email form state
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    loadTrackingData();
  }, []);

  const loadTrackingData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('resume_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false });

      if (error) throw error;
      setTrackingData(data || []);
    } catch (error) {
      console.error('Error loading tracking data:', error);
    }
  };

  const generateTrackingId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // fallback for real UUID format
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  };

  const createEmailTemplate = () => {
    const applicantName = resumeData.personal?.fullName || 'Applicant';
    const position = jobTitle || 'the position';
    const company = companyName || 'your company';

    return `
Subject: Application for ${position}${company !== 'your company' ? ` at ${company}` : ''}

Dear Hiring Manager${recipientName ? ` / ${recipientName}` : ''},

I hope this email finds you well. I am writing to express my strong interest in ${position}${company !== 'your company' ? ` at ${company}` : ''}.

${customMessage || `I believe my background and skills align perfectly with the requirements for this role. Please find my resume attached for your review.`}

I would welcome the opportunity to discuss how my experience and enthusiasm can contribute to your team's success. I am available for an interview at your convenience.

Thank you for considering my application. I look forward to hearing from you soon.

Best regards,
${applicantName}
${resumeData.personal?.email || ''}
${resumeData.personal?.phone || ''}
    `.trim();
  };

  const sendTrackedResume = async () => {
    if (!recipientEmail || !user) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const trackingId = generateTrackingId();
      const trackingUrl = `${window.location.origin}/track/${trackingId}`;
      
      // Call edge function to send email with tracking
      const { data, error } = await supabase.functions.invoke('send-tracked-resume', {
        body: {
          recipientEmail,
          recipientName,
          subject: `Application for ${jobTitle || 'Position'}${companyName ? ` at ${companyName}` : ''}`,
          emailContent: createEmailTemplate(),
          resumeData,
          trackingId,
          trackingUrl,
          senderName: resumeData.personal?.fullName || 'Applicant',
          senderEmail: resumeData.personal?.email || user.email
        }
      });

      if (error) throw error;

      // Save tracking record
      const { error: trackingError } = await supabase
        .from('resume_tracking')
        .insert([{
          id: trackingId,
          user_id: user.id,
          recipient_email: recipientEmail,
          recipient_name: recipientName || null,
          subject: `Application for ${jobTitle || 'Position'}${companyName ? ` at ${companyName}` : ''}`,
          email_content: createEmailTemplate(),
          resume_data: resumeData,
          tracking_url: trackingUrl,
          sender_name: resumeData.personal?.fullName || 'Applicant',
          sender_email: resumeData.personal?.email || user.email,
          sent_at: new Date().toISOString(),
          status: 'sent'
        }]);

      if (trackingError) throw trackingError;

      toast.success('Resume sent successfully with tracking enabled!');
      setActiveTab('analytics');
      loadTrackingData();
      
      // Reset form
      setRecipientEmail('');
      setRecipientName('');
      setJobTitle('');
      setCompanyName('');
      setCustomMessage('');
      
    } catch (error: any) {
      console.error('Error sending tracked resume:', error);
      toast.error('Failed to send resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyTrackingUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Tracking URL copied to clipboard');
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'sent':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'opened':
        return <Eye className="w-4 h-4 text-orange-500" />;
      case 'downloaded':
        return <Download className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string | null) => {
    const variants = {
      sent: 'bg-blue-100 text-blue-800',
      opened: 'bg-orange-100 text-orange-800',
      downloaded: 'bg-green-100 text-green-800'
    };

    const statusKey = status as keyof typeof variants;
    const className = variants[statusKey] || 'bg-gray-100 text-gray-800';
    const displayStatus = status?.charAt(0).toUpperCase() + (status?.slice(1) || '');

    return (
      <Badge className={className}>
        {displayStatus}
      </Badge>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Resume Tracking & Email Automation
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Send your resume with tracking capabilities and automated email templates
              </p>
            </div>
            <Button variant="outline" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="send" className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Resume
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Tracking History
              </TabsTrigger>
            </TabsList>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <TabsContent value="send" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Recipient Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Recipient Email *</label>
                      <Input
                        type="email"
                        placeholder="hiring@company.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Recipient Name</label>
                      <Input
                        placeholder="Hiring Manager"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Job Title</label>
                      <Input
                        placeholder="Software Engineer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Company Name</label>
                      <Input
                        placeholder="Company Inc."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Email Template Preview</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="text-sm space-y-2">
                        <div><strong>To:</strong> {recipientEmail || 'recipient@company.com'}</div>
                        <div><strong>Subject:</strong> Application for {jobTitle || 'Position'}{companyName ? ` at ${companyName}` : ''}</div>
                        <div className="border-t pt-2 mt-2 whitespace-pre-line text-xs">
                          {createEmailTemplate()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Custom Message (Optional)</label>
                  <Textarea
                    placeholder="Add a personal touch to your email..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">🎯 Tracking Features Included:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Email open tracking</li>
                    <li>• Resume download tracking</li>
                    <li>• Location and device information</li>
                    <li>• Real-time analytics dashboard</li>
                  </ul>
                </div>

                <Button 
                  onClick={sendTrackedResume}
                  disabled={loading || !recipientEmail}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? 'Sending...' : 'Send Tracked Resume'}
                </Button>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Send className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{trackingData.length}</div>
                        <div className="text-sm text-gray-600">Total Sent</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {trackingData.filter(d => d.status === 'opened' || d.status === 'downloaded').length}
                        </div>
                        <div className="text-sm text-gray-600">Opened</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Download className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {trackingData.filter(d => d.status === 'downloaded').length}
                        </div>
                        <div className="text-sm text-gray-600">Downloaded</div>
                      </div>
                    </div>
                  </Card>
                </div>

                {trackingData.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes sent yet</h3>
                    <p className="text-gray-600">Start by sending your first tracked resume!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Recent Activity</h3>
                    {trackingData.slice(0, 5).map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(item.status)}
                            <div>
                              <div className="font-medium">{item.recipient_email}</div>
                              <div className="text-sm text-gray-600">{item.subject}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(item.status)}
                            <div className="text-xs text-gray-500 mt-1">
                              {item.sent_at ? new Date(item.sent_at).toLocaleDateString() : 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tracking" className="space-y-6">
                {trackingData.length === 0 ? (
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tracking data available</h3>
                    <p className="text-gray-600">Send your first tracked resume to see analytics here!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trackingData.map((item) => (
                      <Card key={item.id} className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{item.subject}</h4>
                              <p className="text-sm text-gray-600">To: {item.recipient_email}</p>
                            </div>
                            {getStatusBadge(item.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>Sent: {item.sent_at ? new Date(item.sent_at).toLocaleString() : 'Unknown'}</span>
                            </div>
                            
                            {item.opened_at && (
                              <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4 text-orange-500" />
                                <span>Opened: {new Date(item.opened_at).toLocaleString()}</span>
                              </div>
                            )}
                            
                            {item.downloaded_at && (
                              <div className="flex items-center gap-2">
                                <Download className="w-4 h-4 text-green-500" />
                                <span>Downloaded: {new Date(item.downloaded_at).toLocaleString()}</span>
                              </div>
                            )}
                          </div>

                          {item.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>Location: {item.location}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-2 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyTrackingUrl(item.tracking_url)}
                              className="flex items-center gap-2"
                            >
                              <Copy className="w-4 h-4" />
                              Copy Tracking URL
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(item.tracking_url, '_blank')}
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeTracker;
