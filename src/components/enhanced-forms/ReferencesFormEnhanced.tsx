
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Users, User, Building, Mail, Phone, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

interface Reference {
  id: number;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

interface ReferencesFormEnhancedProps {
  data: Reference[];
  onChange: (data: Reference[]) => void;
}

const relationshipTypes = [
  'Former Supervisor',
  'Current Supervisor',
  'Former Colleague',
  'Current Colleague',
  'Client',
  'Mentor',
  'Professor',
  'Business Partner'
];

const ReferencesFormEnhanced: React.FC<ReferencesFormEnhancedProps> = ({ data, onChange }) => {
  const [references, setReferences] = useState<Reference[]>(
    data.length > 0 ? data : [createNewReference()]
  );

  function createNewReference(): Reference {
    return {
      id: Date.now(),
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      relationship: ''
    };
  }

  const updateReference = (id: number, field: keyof Reference, value: string) => {
    const updatedReferences = references.map(ref => 
      ref.id === id ? { ...ref, [field]: value } : ref
    );
    setReferences(updatedReferences);
    onChange(updatedReferences);
  };

  const addReference = () => {
    const newRef = createNewReference();
    const updatedReferences = [...references, newRef];
    setReferences(updatedReferences);
    onChange(updatedReferences);
    toast.success('New reference added');
  };

  const removeReference = (id: number) => {
    if (references.length === 1) {
      toast.error('At least one reference entry is required');
      return;
    }
    const updatedReferences = references.filter(ref => ref.id !== id);
    setReferences(updatedReferences);
    onChange(updatedReferences);
    toast.success('Reference removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            References
          </h2>
          <Badge variant="secondary">{references.length}</Badge>
        </div>
        <Button onClick={addReference} size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Reference
        </Button>
      </div>

      <div className="space-y-6">
        {references.map((ref, index) => (
          <Card key={ref.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  Reference {index + 1}
                  {ref.name && (
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                      - {ref.name}
                    </span>
                  )}
                </CardTitle>
                {references.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeReference(ref.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Name and Title Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${ref.id}`} className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input
                    id={`name-${ref.id}`}
                    value={ref.name}
                    onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                    placeholder="John Smith"
                    className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`title-${ref.id}`} className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Job Title
                  </Label>
                  <Input
                    id={`title-${ref.id}`}
                    value={ref.title}
                    onChange={(e) => updateReference(ref.id, 'title', e.target.value)}
                    placeholder="Senior Manager"
                    className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Company and Relationship Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`company-${ref.id}`} className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Company
                  </Label>
                  <Input
                    id={`company-${ref.id}`}
                    value={ref.company}
                    onChange={(e) => updateReference(ref.id, 'company', e.target.value)}
                    placeholder="Tech Corporation"
                    className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`relationship-${ref.id}`} className="text-sm font-medium">Relationship</Label>
                  <Select 
                    value={ref.relationship} 
                    onValueChange={(value) => updateReference(ref.id, 'relationship', value)}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationshipTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Information Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`email-${ref.id}`} className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id={`email-${ref.id}`}
                    type="email"
                    value={ref.email}
                    onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                    placeholder="john.smith@company.com"
                    className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`phone-${ref.id}`} className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </Label>
                  <Input
                    id={`phone-${ref.id}`}
                    type="tel"
                    value={ref.phone}
                    onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReferencesFormEnhanced;
