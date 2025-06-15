
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, FileText, Target, Send, Eye, Download } from 'lucide-react';

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalResumes: 0,
    totalViews: 0,
    atsScore: 0,
    suggestions: 0,
    totalSent: 0,
    totalOpened: 0,
    totalDownloaded: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      // Load resume count
      const { data: resumes, error: resumeError } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', user?.id);

      if (resumeError) throw resumeError;

      // Load AI suggestions count
      const { data: suggestions, error: suggestionsError } = await supabase
        .from('ai_suggestions')
        .select('id')
        .eq('user_id', user?.id);

      if (suggestionsError) throw suggestionsError;

      // Load user activity count
      const { data: activity, error: activityError } = await supabase
        .from('user_activity')
        .select('id')
        .eq('user_id', user?.id);

      if (activityError) throw activityError;

      // Load tracking data
      const { data: trackingData, error: trackingError } = await supabase
        .from('resume_tracking')
        .select('*')
        .eq('user_id', user?.id);

      if (trackingError) throw trackingError;

      const totalSent = trackingData?.length || 0;
      const totalOpened = trackingData?.filter(item => item.status === 'opened' || item.status === 'downloaded').length || 0;
      const totalDownloaded = trackingData?.filter(item => item.status === 'downloaded').length || 0;

      setAnalytics({
        totalResumes: resumes?.length || 0,
        totalViews: activity?.length || 0,
        atsScore: 85, // Mock ATS score
        suggestions: suggestions?.length || 0,
        totalSent,
        totalOpened,
        totalDownloaded
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(7)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Resumes', value: analytics.totalResumes },
    { name: 'Views', value: analytics.totalViews },
    { name: 'Suggestions', value: analytics.suggestions },
    { name: 'Sent', value: analytics.totalSent },
    { name: 'Opened', value: analytics.totalOpened },
    { name: 'Downloaded', value: analytics.totalDownloaded }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Resumes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalResumes}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalSent}</p>
              </div>
              <Send className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Opened</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalOpened}</p>
              </div>
              <Eye className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Downloaded</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalDownloaded}</p>
              </div>
              <Download className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalViews}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ATS Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.atsScore}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Suggestions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.suggestions}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
