import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Send, BarChart3, Copy, ExternalLink, FileText, Link2, X, Upload, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TrackingData {
  id: string;
  recipient_email: string;
  subject: string;
  sent_at: string | null;
  opened_at?: string | null;
  downloaded_at?: string | null;
  status: string | null;
  tracking_url: string;
  attachments?: { name: string; url: string }[];
}

interface AttachmentFile {
  file: File;
  id: string;
  uploading?: boolean;
}

const ResumeTrackingDashboard: React.FC = () => {
  const { user } = useAuth();
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [attachmentFiles, setAttachmentFiles] = useState<AttachmentFile[]>([]);
  const [attachmentLinks, setAttachmentLinks] = useState<string[]>(['']);
  const [senderEmail, setSenderEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [useAuthEmail, setUseAuthEmail] = useState(true);

  useEffect(() => {
    loadTrackingData();
    
    // Initialize sender info with auth data
    if (user?.email) {
      setSenderEmail(user.email);
      setSenderName(user.email.split('@')[0] || 'Professional');
    }
  }, [user]);

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

  const handleFileInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files) {
      const newFiles = Array.from(evt.target.files).map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        uploading: false
      }));
      setAttachmentFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (fileId: string) => {
    setAttachmentFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleLinkChange = (idx: number, val: string) => {
    setAttachmentLinks((links) => {
      const next = [...links];
      next[idx] = val;
      return next;
    });
  };

  const addAttachmentLink = () => setAttachmentLinks([...attachmentLinks, '']);

  const removeAttachmentLink = (idx: number) => {
    if (attachmentLinks.length > 1) {
      setAttachmentLinks(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const uploadAttachments = async (trackingId: string): Promise<{ name: string; url: string }[]> => {
    const uploaded: { name: string; url: string }[] = [];

    // Upload files to Supabase Storage
    if (attachmentFiles.length > 0) {
      for (const { file } of attachmentFiles) {
        try {
          const path = `${user?.id}/${trackingId}/${file.name}`;
          const { data, error } = await supabase.storage
            .from('attachments')
            .upload(path, file, { upsert: true });
          
          if (error) {
            console.error('File upload error:', error);
            toast.error(`File upload failed: ${error.message}`);
            continue;
          }
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('attachments')
            .getPublicUrl(path);
          
          uploaded.push({ name: file.name, url: publicUrl });
        } catch (error) {
          console.error('Upload error:', error);
          toast.error(`Failed to upload ${file.name}`);
        }
      }
    }

    // Add links if provided
    attachmentLinks.forEach((link) => {
      if (link && link.trim().length > 0) {
        uploaded.push({ name: `Link`, url: link.trim() });
      }
    });

    return uploaded;
  };

  const createEmailTemplate = (attachments: { name: string; url: string }[]) => {
    const fromEmail = useAuthEmail ? user?.email : senderEmail;
    const fromName = useAuthEmail ? (user?.email?.split('@')[0] || 'Professional') : senderName;

    return `
Subject: Application for ${jobTitle || 'the position'}${companyName ? ` at ${companyName}` : ''}

Dear Hiring Manager,

${customMessage || `I am writing to express my interest in the ${jobTitle || 'position'}${companyName ? ` at ${companyName}` : ''}. Please find my resume and relevant documents attached for your review.`}

${attachments.length > 0 ? `\nAttachments/Links:\n${attachments.map((a) => `- ${a.name}: ${a.url}`).join('\n')}` : ''}

Thank you for considering my application. I look forward to hearing from you.

Best regards,
${fromName}
${fromEmail}
    `.trim();
  };

  const sendTrackedResume = async () => {
    const finalSenderEmail = useAuthEmail ? user?.email : senderEmail;
    const finalSenderName = useAuthEmail ? (user?.email?.split('@')[0] || 'Professional') : senderName;

    if (!recipientEmail || !user) {
      toast.error('Please provide a recipient email address');
      return;
    }

    if (!useAuthEmail && (!senderEmail || !senderName)) {
      toast.error('Please provide sender email and name');
      return;
    }

    setLoading(true);
    try {
      const trackingId = generateTrackingId();
      const trackingUrl = `${window.location.origin}/track/${trackingId}`;
      
      // Upload files/links
      const attachments = await uploadAttachments(trackingId);

      // Create resume data with user info and application details
      const resumeData = {
        personal: {
          fullName: finalSenderName,
          email: finalSenderEmail || '',
          phone: ''
        },
        jobTitle: jobTitle || 'Position Application',
        companyName: companyName || '',
        customMessage: customMessage || '',
        attachments: attachments
      };

      // Save tracking record FIRST to ensure it exists before sending email
      const { error: trackingError } = await supabase
        .from('resume_tracking')
        .insert([
          {
            id: trackingId,
            user_id: user.id,
            recipient_email: recipientEmail,
            subject: `Application for ${jobTitle || 'Position'}${companyName ? ` at ${companyName}` : ''}`,
            email_content: createEmailTemplate(attachments),
            tracking_url: trackingUrl,
            sent_at: new Date().toISOString(),
            status: 'sent',
            sender_email: finalSenderEmail || '',
            sender_name: finalSenderName,
            resume_data: resumeData,
          },
        ]);

      if (trackingError) {
        console.error('Error saving tracking record:', trackingError);
        throw new Error('Failed to create tracking record');
      }

      console.log('Tracking record saved successfully with ID:', trackingId);

      // Call edge function to send email with tracking
      const { data, error } = await supabase.functions.invoke('send-tracked-resume', {
        body: {
          recipientEmail,
          recipientName: '',
          subject: `Application for ${jobTitle || 'Position'}${companyName ? ` at ${companyName}` : ''}`,
          emailContent: createEmailTemplate(attachments),
          resumeData: resumeData,
          trackingId,
          trackingUrl,
          senderName: finalSenderName,
          senderEmail: finalSenderEmail || ''
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        // If email fails, update the tracking record status
        await supabase
          .from('resume_tracking')
          .update({ status: 'failed' })
          .eq('id', trackingId);
        throw error;
      }

      toast.success('Application sent successfully with tracking!');
      
      // Reset form
      setRecipientEmail('');
      setJobTitle('');
      setCompanyName('');
      setCustomMessage('');
      setAttachmentFiles([]);
      setAttachmentLinks(['']);
      if (!useAuthEmail) {
        setSenderEmail('');
        setSenderName('');
      }
      
      loadTrackingData();
    } catch (error: any) {
      console.error('Error sending tracked resume:', error);
      toast.error(error.message || 'Failed to send application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyTrackingUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Tracking URL copied to clipboard');
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Resume Tracking & Email Automation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Send Application</h3>
                
                {/* Sender Information */}
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Sender Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="use-auth-email"
                        checked={useAuthEmail}
                        onChange={() => setUseAuthEmail(true)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="use-auth-email" className="text-sm">
                        Use my account email ({user?.email})
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="use-custom-email"
                        checked={!useAuthEmail}
                        onChange={() => setUseAuthEmail(false)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="use-custom-email" className="text-sm">
                        Use custom sender information
                      </label>
                    </div>
                    {!useAuthEmail && (
                      <div className="space-y-2 ml-6">
                        <Input
                          type="email"
                          placeholder="sender@example.com"
                          value={senderEmail}
                          onChange={e => setSenderEmail(e.target.value)}
                        />
                        <Input
                          placeholder="Your Full Name"
                          value={senderName}
                          onChange={e => setSenderName(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Recipient Email *</label>
                  <Input
                    type="email"
                    placeholder="hiring@company.com"
                    value={recipientEmail}
                    onChange={e => setRecipientEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Job Title</label>
                  <Input
                    placeholder="Software Engineer"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <Input
                    placeholder="Company Inc."
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Custom Message</label>
                  <Textarea
                    placeholder="Write a personalized message for this application..."
                    value={customMessage}
                    onChange={e => setCustomMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Attach Files (CV, Cover Letter, etc.)</label>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      onChange={handleFileInput}
                      className="mb-2"
                    />
                    {attachmentFiles.length > 0 && (
                      <div className="space-y-1">
                        {attachmentFiles.map((attachment) => (
                          <div key={attachment.id} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span>{attachment.file.name}</span>
                              <span className="text-gray-500">({(attachment.file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile(attachment.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Additional Links</label>
                  {attachmentLinks.map((link, idx) => (
                    <div className="flex items-center gap-2 mb-2" key={idx}>
                      <Input
                        placeholder="Portfolio, LinkedIn, GitHub, etc..."
                        value={link}
                        onChange={e => handleLinkChange(idx, e.target.value)}
                      />
                      {attachmentLinks.length > 1 && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeAttachmentLink(idx)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      {idx === attachmentLinks.length - 1 && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={addAttachmentLink}
                        >
                          <Link2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  className="bg-purple-600 hover:bg-purple-700 w-full"
                  disabled={loading}
                  onClick={sendTrackedResume}
                >
                  {loading ? 'Sending...' : 'Send Application with Tracking'}
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Email Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg border text-sm min-h-[300px]">
                  <strong>From:</strong> {useAuthEmail ? user?.email : (senderEmail || '[sender email]')} ({useAuthEmail ? (user?.email?.split('@')[0] || 'Professional') : (senderName || '[sender name]')})<br />
                  <strong>To:</strong> {recipientEmail || '[recipient]'}<br />
                  <strong>Subject:</strong> Application for {jobTitle || '[Job Title]'}{companyName ? ` at ${companyName}` : ''}<br />
                  <br />
                  <div className="whitespace-pre-line text-xs border-t pt-2">
                    {createEmailTemplate(
                      attachmentLinks
                        .filter(Boolean)
                        .map(link => ({ name: 'Link', url: link }))
                        .concat(
                          attachmentFiles.map(f => ({ name: f.file.name, url: '[File will be attached]' }))
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trackingData.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                <Send className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No tracked applications yet. Send your first application above!</p>
              </div>
            )}
            {trackingData.map(item => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.status === 'opened' ? 
                      <Eye className="w-4 h-4 text-orange-500" /> : 
                      item.status === 'downloaded' ? 
                      <Download className="w-4 h-4 text-green-500" /> : 
                      <Send className="w-4 h-4 text-blue-500" />
                    }
                    <div>
                      <div className="font-medium">{item.recipient_email}</div>
                      <div className="text-sm text-gray-600">{item.subject}</div>
                      <div className="text-xs text-gray-500">
                        Sent {item.sent_at ? new Date(item.sent_at).toLocaleDateString() : 'Unknown'}
                      </div>
                    </div>
                  </div>
                  <Badge variant={
                    item.status === 'downloaded' ? 'default' :
                    item.status === 'opened' ? 'secondary' :
                    'outline'
                  }>
                    {item.status?.toUpperCase() || 'SENT'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => copyTrackingUrl(item.tracking_url)}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Link
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => window.open(item.tracking_url, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View Tracking
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeTrackingDashboard;
