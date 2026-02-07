import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AssessmentPage from "./pages/AssessmentPage";
import GeneratingPage from "./pages/GeneratingPage";
import DownloadPage from "./pages/DownloadPage";
import ShadowAILandingPage from "./pages/ShadowAILandingPage";
import ShadowAIAssessmentPage from "./pages/ShadowAIAssessmentPage";
import ShadowAIResultsPage from "./pages/ShadowAIResultsPage";
import NotFound from "./pages/NotFound";
import { ShadowAIProvider } from "./contexts/ShadowAIContext";
import { AssessmentProvider } from "./contexts/AssessmentContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AssessmentProvider>
          <ShadowAIProvider>
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/generating" element={<GeneratingPage />} />
            <Route path="/download" element={<DownloadPage />} />
            <Route path="/shadow-ai" element={<ShadowAILandingPage />} />
            <Route path="/shadow-ai/assessment" element={<ShadowAIAssessmentPage />} />
            <Route path="/shadow-ai/results" element={<ShadowAIResultsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </ShadowAIProvider>
        </AssessmentProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
