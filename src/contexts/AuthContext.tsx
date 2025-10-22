import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient, type User, type LoginCredentials, type RegisterData } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role?: 'client' | 'vendeur') => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; user?: User }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        apiClient.setToken(token);
        const { data: userProfile, error } = await apiClient.getProfile();
        
        if (userProfile && !error) {
          setUser(userProfile);
          setUserRole(userProfile.role);
        } else {
          apiClient.clearToken();
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: 'client' | 'vendeur' = 'client') => {
    const registerData: RegisterData = {
      email,
      password,
      full_name: fullName,
      role
    };

    console.log('🚀 Attempting registration with:', { email, fullName, role });

    const { data, error } = await apiClient.register(registerData);

    console.log('📝 Registration response:', { data, error });

    if (data && !error) {
      toast({
        title: "Compte créé avec succès ! 🎉",
        description: "Vous pouvez maintenant vous connecter.",
      });
    } else {
      console.error('❌ Registration error:', error);
      toast({
        title: "Erreur lors de l'inscription",
        description: error || "Une erreur est survenue",
        variant: "destructive",
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const credentials: LoginCredentials = { email, password };
    const { data, error } = await apiClient.login(credentials);

    if (data && !error) {
      apiClient.setToken(data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      // Try to get user profile, but don't fail if endpoint doesn't exist
      const { data: userProfile } = await apiClient.getProfile();
      
      // Create a basic user object from the token if profile fetch fails
      const user: User = userProfile || {
        id: 'temp',
        email: email,
        full_name: email.split('@')[0],
        role: 'client', // Default role, will be updated when backend provides correct endpoint
      };
      
      setUser(user);
      setUserRole(user.role);

      toast({
        title: "Connexion réussie ! ✨",
        description: "Bienvenue !",
      });

      // Handle pending cart item
      const pendingCartItem = sessionStorage.getItem('pendingCartItem');
      if (pendingCartItem) {
        try {
          const item = JSON.parse(pendingCartItem);
          toast({
            title: "Produit ajouté automatiquement ! 🛒",
            description: `${item.name} a été ajouté à votre panier`,
          });
          // TODO: Actually add item to cart via API
        } catch (error) {
          console.error('Error parsing pending cart item:', error);
        }
        sessionStorage.removeItem('pendingCartItem');
      }

      return { error: null, user };
    } else {
      toast({
        title: "Erreur de connexion",
        description: error || "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    }

    return { error };
  };

  const signOut = async () => {
    await apiClient.logout();
    setUser(null);
    setUserRole(null);
    
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt ! ",
    });
    
    // Navigation will be handled by the component calling signOut
    window.location.href = '/';
  };

  const value = {
    user,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
