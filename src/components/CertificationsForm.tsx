
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Award } from 'lucide-react';
import { toast } from 'sonner';

interface Certification {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
}

interface CertificationsFormProps {
  data: Certification[];
  onChange: (data: Certification[]) => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({ data, onChange }) => {
  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now(),
      name: '',
      issuer: '',
      date: '',
      credentialId: ''
    };
    onChange([...data, newCert]);
    toast.success('New certification added');
  };

  const updateCertification = (id: number, field: keyof Certification, value: string) => {
    onChange(data.map(cert => cert.id === id ? { ...cert, [field]: value } : cert));
  };

  const removeCertification = (id: number) => {
    onChange(data.filter(cert => cert.id !== id));
    toast.success('Certification removed');
  };

  // Suggested certifications based on common industry standards
  const suggestedCerts = [
    'AWS Certified Solutions Architect',
    'Google Cloud Professional',
    'Microsoft Azure Fundamentals',
    'PMP - Project Management Professional',
    'Certified Scrum Master',
    'CompTIA Security+',
    'Cisco CCNA',
    'Google Analytics Certified'
  ];

  const addSuggestedCert = (certName: string) => {
    const newCert: Certification = {
      id: Date.now(),
      name: certName,
      issuer: '',
      date: '',
      credentialId: ''
    };
    onChange([...data, newCert]);
    toast.success(`Added ${certName}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Certifications
          </div>
          <Button onClick={addCertification} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Suggested Certifications */}
        {data.length === 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-blue-900 dark:text-blue-100">Popular Certifications</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedCerts.map((cert) => (
                <Button
                  key={cert}
                  variant="outline"
                  size="sm"
                  onClick={() => addSuggestedCert(cert)}
                  className="justify-start text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {cert}
                </Button>
              ))}
            </div>
          </div>
        )}

        {data.map((cert, index) => (
          <div key={cert.id} className="border rounded-lg p-4 space-y-4 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Certification {index + 1}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeCertification(cert.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Certification Name *</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  placeholder="e.g., AWS Certified Solutions Architect"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Issuing Organization *</Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  placeholder="e.g., Amazon Web Services"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Issue Date</Label>
                <Input
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                  placeholder="e.g., January 2024"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Credential ID</Label>
                <Input
                  value={cert.credentialId}
                  onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                  placeholder="e.g., ABC123XYZ"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        ))}
        
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No certifications added yet.</p>
            <p className="text-sm">Click "Add Certification" or choose from popular options above.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificationsForm;
