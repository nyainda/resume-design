
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAPIKey } from '@/hooks/useAPIKey';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CoverLetterTemplates from '@/components/CoverLetterTemplates';
import { 
  ArrowLeft,
  Save,
  Download,
  Sparkles,
  FileText,
  Building,
  User,
  Moon,
  Sun,
  Wand2,
  Palette
} from 'lucide-react';

const CoverLetterBuilder = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { getApiKey } = useAPIKey();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const coverLetterId = searchParams.get('id');
  const resumeId = searchParams.get('resume');
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [resumes, setResumes] = useState<any[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

  const [coverLetterData, setCoverLetterData] = useState({
    id: '',
    title: 'Untitled Cover Letter',
    companyName: '',
    positionTitle: '',
    content: '',
    resumeId: resumeId || 'none',
    templateId: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadData();
  }, [user, coverLetterId, navigate]);

  const loadData = async () => {
    try {
      // Load resumes for selection
      const { data: resumesData, error: resumesError } = await supabase
        .from('resumes')
        .select('id, title')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (resumesError) throw resumesError;
      setResumes(resumesData || []);

      // Load cover letter if editing
      if (coverLetterId) {
        const { data, error } = await (supabase as any)
          .from('cover_letters')
          .select('*')
          .eq('id', coverLetterId)
          .eq('user_id', user?.id)
          .single();

        if (error) {
          console.error('Error loading cover letter:', error);
          toast({
            title: "Error",
            description: "Cover letter not found",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }

        setCoverLetterData({
          id: data.id,
          title: data.title || 'Untitled Cover Letter',
          companyName: data.company_name || '',
          positionTitle: data.position_title || '',
          content: data.content || '',
          resumeId: data.resume_id || 'none',
          templateId: data.template_id || 0
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCoverLetter = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const payload = {
        title: coverLetterData.title,
        company_name: coverLetterData.companyName,
        position_title: coverLetterData.positionTitle,
        content: coverLetterData.content,
        resume_id: coverLetterData.resumeId === 'none' ? null : coverLetterData.resumeId,
        template_id: coverLetterData.templateId,
        user_id: user.id
      };

      if (coverLetterId) {
        const { error } = await (supabase as any)
          .from('cover_letters')
          .update(payload)
          .eq('id', coverLetterId)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        const { data, error } = await (supabase as any)
          .from('cover_letters')
          .insert([payload])
          .select()
          .single();
        
        if (error) throw error;
        
        navigate(`/cover-letter-builder?id=${data.id}`, { replace: true });
        setCoverLetterData(prev => ({ ...prev, id: data.id }));
      }

      toast({
        title: "Success",
        description: "Cover letter saved successfully"
      });
    } catch (error) {
      console.error('Error saving cover letter:', error);
      toast({
        title: "Error",
        description: "Failed to save cover letter",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const generateWithAI = async () => {
    if (!coverLetterData.companyName || !coverLetterData.positionTitle) {
      toast({
        title: "Missing Information",
        description: "Please enter company name and position title first",
        variant: "destructive"
      });
      return;
    }

    const apiKey = getApiKey('gemini');
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key in Settings to use AI generation",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      // Get resume data if selected
      let resumeData = null;
      if (coverLetterData.resumeId && coverLetterData.resumeId !== 'none') {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', coverLetterData.resumeId)
          .single();
        
        if (!error) resumeData = data;
      }

      // Create a detailed prompt for Gemini AI
      const prompt = `Create a professional cover letter for a ${coverLetterData.positionTitle} position at ${coverLetterData.companyName}. 

      Job Details:
      - Position: ${coverLetterData.positionTitle}
      - Company: ${coverLetterData.companyName}
      
      ${resumeData ? `
      Candidate Background:
      - Name: ${resumeData.personal_info?.fullName || 'Candidate'}
      - Summary: ${resumeData.personal_info?.summary || 'Experienced professional'}
      - Skills: ${resumeData.skills?.join(', ') || 'Relevant professional skills'}
      - Experience: ${resumeData.experience?.map((exp: any) => `${exp.position} at ${exp.company}`).join(', ') || 'Professional experience'}
      - Education: ${resumeData.education?.map((edu: any) => `${edu.degree} from ${edu.school}`).join(', ') || 'Relevant education'}
      ` : ''}
      
      Please write a compelling, personalized cover letter that:
      1. Opens with enthusiasm for the specific role and company
      2. Highlights relevant experience and achievements
      3. Demonstrates knowledge of the company/industry
      4. Shows how the candidate can add value
      5. Closes with a strong call to action
      6. Maintains a professional yet engaging tone
      7. Is approximately 3-4 paragraphs long
      
      Format the response as a proper cover letter with appropriate salutation and closing.`;

      console.log('Generating cover letter with prompt:', prompt);

      const response = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      if (response.error) {
        console.error('Gemini API error:', response.error);
        throw new Error(response.error.details || 'Failed to generate cover letter with AI');
      }

      if (response.data?.content) {
        setCoverLetterData(prev => ({
          ...prev,
          content: response.data.content
        }));

        toast({
          title: "Cover Letter Generated",
          description: "AI has created a personalized cover letter based on your information"
        });
      } else {
        throw new Error('No content generated from AI');
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate cover letter",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!previewRef.current || !coverLetterData.content.trim()) {
      toast({
        title: "Error",
        description: "Please add content to your cover letter before downloading",
        variant: "destructive"
      });
      return;
    }

    setDownloadingPDF(true);
    try {
      const element = previewRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgDisplayWidth = imgWidth * ratio;
      const imgDisplayHeight = imgHeight * ratio;
      
      // Add some padding and center the content
      const padding = 10;
      const x = (pdfWidth - imgDisplayWidth) / 2;
      const y = padding;

      pdf.addImage(imgData, 'PNG', x, y, imgDisplayWidth, imgDisplayHeight - padding);
      
      const fileName = `${coverLetterData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_cover_letter.pdf`;
      pdf.save(fileName);

      toast({
        title: "Success",
        description: "Cover letter PDF downloaded successfully"
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleTemplateSelect = (templateId: number) => {
    setCoverLetterData(prev => ({ ...prev, templateId }));
    setShowTemplates(false);
    toast({
      title: "Template Selected",
      description: "Template updated! Click 'Generate with AI' to apply it to your content"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading cover letter...</p>
        </div>
      </div>
    );
  }

  if (showTemplates) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setShowTemplates(false)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Choose a Template
            </h1>
            <div></div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto p-6">
          <CoverLetterTemplates 
            onSelectTemplate={handleTemplateSelect}
            selectedTemplate={coverLetterData.templateId}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Input
              value={coverLetterData.title}
              onChange={(e) => setCoverLetterData(prev => ({ ...prev, title: e.target.value }))}
              className="text-xl font-semibold border-0 p-0 bg-transparent dark:text-white"
              placeholder="Cover Letter Title"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              onClick={saveCoverLetter}
              disabled={saving}
              className="border-gray-300 dark:border-gray-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              onClick={downloadPDF}
              disabled={downloadingPDF || !coverLetterData.content.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              {downloadingPDF ? 'Generating PDF...' : 'Download PDF'}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-sm">
              <div className="space-y-6">
                {/* Template Selection */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Palette className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Template Selection
                    </h2>
                  </div>
                  
                  <Button
                    onClick={() => setShowTemplates(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Choose Template (Currently: Template {coverLetterData.templateId + 1})
                  </Button>
                </div>

                <Separator />

                {/* Company and Position Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Building className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Job Information
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName" className="dark:text-gray-200">Company Name</Label>
                      <Input
                        id="companyName"
                        value={coverLetterData.companyName}
                        onChange={(e) => setCoverLetterData(prev => ({ ...prev, companyName: e.target.value }))}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="positionTitle" className="dark:text-gray-200">Position Title</Label>
                      <Input
                        id="positionTitle"
                        value={coverLetterData.positionTitle}
                        onChange={(e) => setCoverLetterData(prev => ({ ...prev, positionTitle: e.target.value }))}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Enter position title"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="resumeSelect" className="dark:text-gray-200">Link to Resume (Optional)</Label>
                    <Select 
                      value={coverLetterData.resumeId} 
                      onValueChange={(value) => setCoverLetterData(prev => ({ ...prev, resumeId: value }))}
                    >
                      <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600">
                        <SelectValue placeholder="Select a resume to link" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No resume selected</SelectItem>
                        {resumes.map((resume) => (
                          <SelectItem key={resume.id} value={resume.id}>
                            {resume.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* AI Generation */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      AI Assistant
                    </h2>
                  </div>
                  
                  <Button
                    onClick={generateWithAI}
                    disabled={generating || !coverLetterData.companyName || !coverLetterData.positionTitle}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {generating ? 'Generating...' : 'Generate Cover Letter with Gemini AI'}
                  </Button>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Gemini AI will create a personalized cover letter based on your job information and linked resume data.
                  </p>
                </div>

                <Separator />

                {/* Content Editor */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Cover Letter Content
                    </h2>
                  </div>
                  
                  <div>
                    <Label htmlFor="content" className="dark:text-gray-200">Letter Content</Label>
                    <Textarea
                      id="content"
                      value={coverLetterData.content}
                      onChange={(e) => setCoverLetterData(prev => ({ ...prev, content: e.target.value }))}
                      className="mt-1 min-h-[400px] dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Write your cover letter content here, or use the AI generator above to create personalized content..."
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="sticky top-24">
            <Card className="p-8 bg-white dark:bg-gray-800 shadow-sm min-h-[600px]">
              <div ref={previewRef} data-preview-ref className="space-y-6 bg-white text-black p-8 rounded" style={{ minHeight: '500px' }}>
                <div className="text-center border-b border-gray-200 pb-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Cover Letter
                  </h1>
                  {coverLetterData.companyName && coverLetterData.positionTitle && (
                    <p className="text-gray-600 mt-2">
                      {coverLetterData.positionTitle} at {coverLetterData.companyName}
                    </p>
                  )}
                </div>
                
                <div className="prose max-w-none">
                  {coverLetterData.content ? (
                    <div className="whitespace-pre-wrap text-gray-900 leading-relaxed text-sm">
                      {coverLetterData.content}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">Your cover letter preview will appear here</p>
                      <p className="text-sm">Fill in the job information and use Gemini AI to generate compelling content</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterBuilder;
