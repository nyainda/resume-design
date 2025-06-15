
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Users } from 'lucide-react';

interface Reference {
  id: number;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

interface ReferencesFormProps {
  data: Reference[];
  onChange: (data: Reference[]) => void;
}

const ReferencesForm: React.FC<ReferencesFormProps> = ({ data, onChange }) => {
  const addReference = () => {
    const newRef: Reference = {
      id: Date.now(),
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      relationship: ''
    };
    onChange([...data, newRef]);
  };

  const updateReference = (id: number, field: keyof Reference, value: string) => {
    onChange(data.map(ref => ref.id === id ? { ...ref, [field]: value } : ref));
  };

  const removeReference = (id: number) => {
    onChange(data.filter(ref => ref.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">References</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add professional references</p>
          </div>
        </div>
        <Button onClick={addReference} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Reference
        </Button>
      </div>

      {data.map((ref, index) => (
        <Card key={ref.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-green-950/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <CardHeader className="relative pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-lg flex items-center justify-center">
                  <span className="text-green-700 dark:text-green-300 font-bold text-sm">{index + 1}</span>
                </div>
                <CardTitle className="text-lg text-gray-900 dark:text-white">Reference {index + 1}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeReference(ref.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="relative space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name *
                </Label>
                <Input
                  value={ref.name}
                  onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                  placeholder="John Smith"
                  className="border-green-200 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Title
                </Label>
                <Input
                  value={ref.title}
                  onChange={(e) => updateReference(ref.id, 'title', e.target.value)}
                  placeholder="Senior Manager"
                  className="border-green-200 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company
                </Label>
                <Input
                  value={ref.company}
                  onChange={(e) => updateReference(ref.id, 'company', e.target.value)}
                  placeholder="Tech Corporation"
                  className="border-green-200 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Relationship
                </Label>
                <Input
                  value={ref.relationship}
                  onChange={(e) => updateReference(ref.id, 'relationship', e.target.value)}
                  placeholder="Direct Supervisor"
                  className="border-green-200 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <Input
                  type="email"
                  value={ref.email}
                  onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                  placeholder="john.smith@company.com"
                  className="border-green-200 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </Label>
                <Input
                  type="tel"
                  value={ref.phone}
                  onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="border-green-200 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {data.length === 0 && (
        <Card className="border-2 border-dashed border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900">No references added yet</h3>
            <p className="text-sm text-gray-600 mb-4">Click "Add Reference" to include professional references</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReferencesForm;
