import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/Auth";
import AddRestaurantPage from "./pages/AddRestaurant";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
import { useAuthStore } from "./stores/authStore";
import { useProfileStore } from "./stores/profileStore";
import PublicHomePage from "./pages/PublicHome";
import RestaurantDetailPage from "./pages/RestaurantDetail";
import Dashboard from "./pages/Dashboard";
import EditRestaurantPage from "./pages/EditRestaurant";
import MapPage from "./pages/MapPage";
import SignUpPage from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const navigate = useNavigate();
  const { session, setSession } = useAuthStore();
  const { fetchProfile } = useProfileStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchProfile(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchProfile(session);
      if (_event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [setSession, navigate, fetchProfile]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicHomePage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
      <Route path="/auth" element={!session ? <AuthPage /> : <Navigate to="/dashboard" />} />
      <Route path="/sign-up" element={!session ? <SignUpPage /> : <Navigate to="/dashboard" />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/auth" />} />
      <Route path="/add-restaurant" element={session ? <AddRestaurantPage /> : <Navigate to="/auth" />} />
      <Route path="/edit-restaurant/:id" element={session ? <EditRestaurantPage /> : <Navigate to="/auth" />} />
      <Route path="/admin" element={session ? <AdminDashboard /> : <Navigate to="/auth" />} />

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