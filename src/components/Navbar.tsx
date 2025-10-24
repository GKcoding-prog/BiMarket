import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut, Menu, X, Search, Heart, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api";
import { ModeToggle } from "@/components/mode-toggle";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut, userRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);

  // Fetch wishlist count when user is logged in
  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (user) {
        const { data } = await apiClient.getWishlist();
        if (data) {
          setWishlistCount(data.count || 0);
        }
      } else {
        setWishlistCount(0);
      }
    };
    
    fetchWishlistCount();
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleCartClick = () => {
    if (!user) {
      // Store intended destination and redirect to login
      sessionStorage.setItem('redirectAfterLogin', '/cart');
      navigate("/login");
      return;
    }
    navigate("/cart");
  };

  const handleProfileAction = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              BiMarket
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Accueil
            </Link>
            <Link to="/products" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Produits
            </Link>
            <Link to="/categories" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Catégories
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center space-x-2 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-muted/50"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button - Mobile/Tablet */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <ModeToggle />

            {/* Wishlist - Only for logged in users */}
            {user && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hidden sm:flex"
                onClick={() => navigate("/dashboard?tab=wishlist")}
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleCartClick}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0">
                {user ? '3' : '0'}
              </Badge>
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start space-x-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.full_name || 'Utilisateur'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <Badge variant="outline" className="w-fit text-xs">
                        {userRole === 'vendeur' ? 'Vendeur' : 'Client'}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Tableau de bord</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/cart")}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>Mon panier</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    <Package className="mr-2 h-4 w-4" />
                    <span>Mes commandes</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate("/login")} size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <User className="h-4 w-4 mr-2" />
                Se connecter
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4 animate-fade-in">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher des produits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 w-full bg-muted/50"
                />
              </div>
            </form>

            {/* Mobile Navigation */}
            <div className="space-y-2">
              <Link 
                to="/" 
                className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                to="/products" 
                className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Produits
              </Link>
              <Link 
                to="/categories" 
                className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Catégories
              </Link>
              
              {!user && (
                <Button 
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }} 
                  className="w-full mt-4 bg-gradient-to-r from-primary to-primary/80"
                >
                  Se connecter
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
