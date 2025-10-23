import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient, type User, type LoginCredentials, type RegisterData } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, phone?: string, role?: 'client' | 'vendeur') => Promise<{ error: any }>;
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
          console.log('✅ User restored from profile:', userProfile);
        } else {
          // Profile endpoint failed, try to restore from localStorage
          const storedEmail = localStorage.getItem('user_email');
          if (storedEmail) {
            const storedRole = localStorage.getItem(`user_role_${storedEmail}`) as 'client' | 'vendeur' | null;
            
            const fallbackUser: User = {
              id: 'temp',
              email: storedEmail,
              full_name: storedEmail.split('@')[0],
              role: storedRole || 'client',
            };
            
            setUser(fallbackUser);
            setUserRole(fallbackUser.role);
            console.log('✅ User restored from localStorage:', fallbackUser);
          } else {
            apiClient.clearToken();
          }
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone: string = "", role: 'client' | 'vendeur' = 'client') => {
    // Generate username from email (or could use first+last name)
    const username = email.split('@')[0];
    
    const registerData: RegisterData = {
      email,
      password,
      username,
      first_name: firstName,
      last_name: lastName,
      phone,
      role
    };

    console.log('🚀 Attempting registration with:', { email, username, firstName, lastName, phone, role });

    const { data, error } = await apiClient.register(registerData);

    console.log('📝 Registration response:', { data, error });

    if (data && !error) {
      // Store the user's role locally for login fallback
      localStorage.setItem(`user_role_${email}`, role);
      
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
      localStorage.setItem('user_email', email); // Store email for session restoration
      
      // Try to get user profile
      const { data: userProfile } = await apiClient.getProfile();
      
      // Use profile data if available, otherwise create basic user object
      let user: User;
      
      if (userProfile) {
        user = userProfile;
      } else {
        // Check if we have stored role from registration
        const storedRole = localStorage.getItem(`user_role_${email}`) as 'client' | 'vendeur' | null;
        
        user = {
          id: 'temp',
          email: email,
          full_name: email.split('@')[0],
          role: storedRole || 'client', // Use stored role or default to client
        };
      }
      
      setUser(user);
      setUserRole(user.role);

      console.log('✅ User logged in:', { email: user.email, role: user.role });

      toast({
        title: "Connexion réussie ! ✨",
        description: `Bienvenue ${user.role === 'vendeur' ? 'vendeur' : ''} !`,
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
    localStorage.removeItem('user_email'); // Clear stored email
    
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
