
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Wand2, Loader2, Award, Building, Calendar, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';

interface Certification {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
}

interface CertificationsFormEnhancedProps {
  data: Certification[];
  onChange: (data: Certification[]) => void;
}

const CertificationsFormEnhanced: React.FC<CertificationsFormEnhancedProps> = ({ data, onChange }) => {
  const { apiKey } = useAPIKey();
  const [generatingAI, setGeneratingAI] = useState<number | null>(null);

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now(),
      name: '',
      issuer: '',
      date: '',
      credentialId: ''
    };
    onChange([...data, newCert]);
  };

  const updateCertification = (id: number, field: keyof Certification, value: string) => {
    onChange(data.map(cert => cert.id === id ? { ...cert, [field]: value } : cert));
  };

  const removeCertification = (id: number) => {
    onChange(data.filter(cert => cert.id !== id));
  };

  const generateAISuggestions = async (certId: number) => {
    const certification = data.find(cert => cert.id === certId);
    if (!certification || !certification.name) {
      toast.error('Please fill in certification name first');
      return;
    }

    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings');
      return;
    }

    setGeneratingAI(certId);
    try {
      const prompt = `Suggest the most likely issuer for this certification: "${certification.name}". Provide only the organization name, nothing else.`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      if (error) throw error;

      if (result?.content) {
        updateCertification(certId, 'issuer', result.content.trim());
        toast.success('AI suggestion applied!');
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast.error(`Failed to generate suggestion: ${error.message}`);
    } finally {
      setGeneratingAI(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Certifications</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add your professional certifications</p>
          </div>
        </div>
        <Button onClick={addCertification} className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {data.map((cert, index) => (
        <Card key={cert.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800 dark:to-amber-950/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <CardHeader className="relative pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 rounded-lg flex items-center justify-center">
                  <span className="text-amber-700 dark:text-amber-300 font-bold text-sm">{index + 1}</span>
                </div>
                <CardTitle className="text-lg text-gray-900 dark:text-white">Certification {index + 1}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCertification(cert.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="relative space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Certification Name *
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateAISuggestions(cert.id)}
                    disabled={generatingAI === cert.id || !cert.name}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200"
                  >
                    {generatingAI === cert.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Wand2 className="w-3 h-3 text-purple-600" />
                    )}
                    <span className="text-xs text-purple-700">AI Suggest Issuer</span>
                  </Button>
                </div>
                <Input
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                  className="border-amber-200 focus:border-amber-500 focus:ring-amber-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Issuing Organization
                </Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                  className="border-amber-200 focus:border-amber-500 focus:ring-amber-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date Obtained
                </Label>
                <Input
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                  placeholder="2024"
                  className="border-amber-200 focus:border-amber-500 focus:ring-amber-500/20"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Credential ID
                </Label>
                <Input
                  value={cert.credentialId}
                  onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                  placeholder="ABC123DEF456"
                  className="border-amber-200 focus:border-amber-500 focus:ring-amber-500/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {data.length === 0 && (
        <Card className="border-2 border-dashed border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/50">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900">No certifications added yet</h3>
            <p className="text-sm text-gray-600 mb-4">Click "Add Certification" to showcase your professional credentials</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CertificationsFormEnhanced;
