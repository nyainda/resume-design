
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import Templates from "./pages/Templates";
import CVOptimizer from "./pages/CVOptimizer";
import CoverLetterBuilder from "./pages/CoverLetterBuilder";
import ATSChecker from "./pages/ATSChecker";
import NotFound from "./pages/NotFound";
import TrackingPage from "./pages/TrackingPage";
import NotificationSystem from "@/components/NotificationSystem";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/builder" element={<Builder />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/cv-optimizer" element={<CVOptimizer />} />
                  <Route path="/ats-checker" element={<ATSChecker />} />
                  <Route path="/cover-letter" element={<CoverLetterBuilder />} />
                  <Route path="/cover-letter-builder" element={<CoverLetterBuilder />} />
                  <Route path="/track/:trackingId" element={<TrackingPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
