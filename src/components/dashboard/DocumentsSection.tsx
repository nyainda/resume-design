
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  FileText, 
  Search, 
  Edit,
  Trash2,
  Eye,
  Calendar,
  Mail,
  Building,
  Briefcase,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Resume {
  id: string;
  title: string;
  template_id: number;
  created_at: string;
  updated_at: string;
}

interface CoverLetter {
  id: string;
  title: string;
  company_name: string;
  position_title: string;
  created_at: string;
  updated_at: string;
}

interface DocumentsSectionProps {
  resumes: Resume[];
  coverLetters: CoverLetter[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  createNewResume: () => void;
  createNewCoverLetter: () => void;
  handleDeleteResume: (id: string) => void;
  handleDeleteCoverLetter: (id: string) => void;
  previewResume: (resume: Resume) => void;
  previewCoverLetter: (coverLetter: CoverLetter) => void;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  resumes,
  coverLetters,
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  createNewResume,
  createNewCoverLetter,
  handleDeleteResume,
  handleDeleteCoverLetter,
  previewResume,
  previewCoverLetter
}) => {
  const navigate = useNavigate();

  const filteredResumes = resumes.filter(resume =>
    resume.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCoverLetters = coverLetters.filter(cl =>
    cl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cl.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cl.position_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
          />
        </div>
      </div>

      {/* Documents Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 bg-gray-100 dark:bg-gray-800/50 border dark:border-gray-700 h-auto p-1">
          <TabsTrigger value="resumes" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Resumes ({resumes.length})</span>
          </TabsTrigger>
          <TabsTrigger value="cover-letters" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">
            <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Cover Letters ({coverLetters.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resumes">
          {filteredResumes.length === 0 ? (
            <Card className="p-6 sm:p-8 lg:p-12 text-center bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-lg">
              <FileText className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                No resumes yet
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                Create your first resume to get started
              </p>
              <Button onClick={createNewResume} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Resume
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {filteredResumes.map((resume) => (
                <Card key={resume.id} className="hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm sm:text-base lg:text-lg mb-1 text-gray-900 dark:text-white truncate">{resume.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span className="truncate">Updated {new Date(resume.updated_at).toLocaleDateString()}</span>
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs shrink-0">Template {resume.template_id + 1}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                      <div className="flex gap-1 sm:gap-2 flex-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/builder?id=${resume.id}`)}
                          className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs flex-1 sm:flex-none"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          <span>Edit</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => previewResume(resume)}
                          className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs flex-1 sm:flex-none"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          <span>Preview</span>
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteResume(resume.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cover-letters">
          {filteredCoverLetters.length === 0 ? (
            <Card className="p-6 sm:p-8 lg:p-12 text-center bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-lg">
              <Mail className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                No cover letters yet
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                Create your first cover letter to get started
              </p>
              <Button onClick={createNewCoverLetter} className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Cover Letter
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {filteredCoverLetters.map((coverLetter) => (
                <Card key={coverLetter.id} className="hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm sm:text-base lg:text-lg mb-1 text-gray-900 dark:text-white truncate">{coverLetter.title}</CardTitle>
                        <CardDescription className="space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          {coverLetter.company_name && (
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Building className="h-3 w-3 shrink-0" />
                              <span className="truncate">{coverLetter.company_name}</span>
                            </div>
                          )}
                          {coverLetter.position_title && (
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Briefcase className="h-3 w-3 shrink-0" />
                              <span className="truncate">{coverLetter.position_title}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Clock className="h-3 w-3 shrink-0" />
                            <span className="truncate">Updated {new Date(coverLetter.updated_at).toLocaleDateString()}</span>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                      <div className="flex gap-1 sm:gap-2 flex-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/cover-letter-builder?id=${coverLetter.id}`)}
                          className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs flex-1 sm:flex-none"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          <span>Edit</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => previewCoverLetter(coverLetter)}
                          className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs flex-1 sm:flex-none"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          <span>Preview</span>
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCoverLetter(coverLetter.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentsSection;
