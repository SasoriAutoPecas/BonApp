import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
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
import DashboardLayout from "./components/DashboardLayout";
import TermsPage from "./pages/Terms";
import AboutPage from "./pages/About";
import CuisinesPage from "./pages/Cuisines";

const queryClient = new QueryClient();

const ProtectedRoutes = () => {
  const { session } = useAuthStore();
  return session ? <DashboardLayout /> : <Navigate to="/auth" />;
};

const AppRoutes = () => {
  const navigate = useNavigate();
  const { setSession } = useAuthStore();
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
      <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/termos" element={<TermsPage />} />
      <Route path="/sobre-nos" element={<AboutPage />} />
      <Route path="/culinarias" element={<CuisinesPage />} />
      
      {/* Routes that can be public or private */}
      <Route path="/map" element={<MapPage />} />

      {/* Protected Routes with Layout */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-restaurant" element={<AddRestaurantPage />} />
        <Route path="/edit-restaurant/:id" element={<EditRestaurantPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

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