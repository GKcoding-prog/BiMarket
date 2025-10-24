import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/theme-provider";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import ClientDashboard from "./pages/ClientDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const DashboardRouter = () => {
  const { userRole, loading, user } = useAuth();
  
  // Check localStorage directly
  const storedEmail = localStorage.getItem('user_email');
  const storedRole = storedEmail ? localStorage.getItem(`user_role_${storedEmail}`) : null;
  
  console.log('🔍 DashboardRouter Debug Info:');
  console.log('  - userRole from context:', userRole);
  console.log('  - userRole type:', typeof userRole);
  console.log('  - user from context:', user);
  console.log('  - storedEmail:', storedEmail);
  console.log('  - storedRole:', storedRole);
  console.log('  - loading:', loading);
  console.log('  - Check: userRole === "vendeur":', userRole === 'vendeur');
  console.log('  - Check: storedRole === "vendeur":', storedRole === 'vendeur');
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }
  
  if (userRole === 'vendeur') {
    console.log('✅ Routing to SellerDashboard');
    return <SellerDashboard />;
  }
  
  console.log('✅ Routing to ClientDashboard (default)');
  return <ClientDashboard />;
};

const AppContent = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="bimarket-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
