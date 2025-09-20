import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/Auth";
import HomeScreen from "./pages/HomeScreen";
import AddRestaurantPage from "./pages/AddRestaurant";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
import { useAuthStore } from "./stores/authStore";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const navigate = useNavigate();
  const { session, setSession } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [setSession, navigate]);

  return (
    <Routes>
      <Route path="/auth" element={!session ? <AuthPage /> : <Navigate to="/" />} />
      
      {/* Protected Routes */}
      <Route path="/" element={session ? <HomeScreen /> : <Navigate to="/auth" />} />
      <Route path="/add-restaurant" element={session ? <AddRestaurantPage /> : <Navigate to="/auth" />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;