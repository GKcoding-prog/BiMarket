import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, Headphones, Star, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const featuredProducts = [
    { id: 1, name: "Casque Audio Premium", price: 199.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", category: "Audio" },
    { id: 2, name: "Montre Connectée Pro", price: 299.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", category: "Tech" },
    { id: 3, name: "Sac à Dos Design", price: 89.99, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", category: "Mode" },
    { id: 4, name: "Sneakers Édition Limitée", price: 149.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", category: "Chaussures" },
  ];

  const features = [
    { 
      icon: Truck, 
      title: "Livraison Gratuite", 
      description: "Sur toutes les commandes de plus de 50€",
      color: "bg-blue-500/10 text-blue-600"
    },
    { 
      icon: Shield, 
      title: "Paiement Sécurisé", 
      description: "Vos données sont protégées",
      color: "bg-green-500/10 text-green-600"
    },
    { 
      icon: Headphones, 
      title: "Support 24/7", 
      description: "Notre équipe est toujours disponible",
      color: "bg-purple-500/10 text-purple-600"
    },
  ];

  const stats = [
    { label: "Clients satisfaits", value: "10K+", icon: Star },
    { label: "Produits vendus", value: "50K+", icon: TrendingUp },
    { label: "Années d'expérience", value: "5+", icon: Shield },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="h-full w-full bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Welcome Badge */}
            <Badge variant="outline" className="text-sm px-4 py-2 bg-background/50 backdrop-blur-sm">
              🎉 Bienvenue sur BiMarket - Votre marketplace de confiance
            </Badge>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
              Découvrez l'Excellence
              <span className="block text-primary">Shopping</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Une sélection exclusive de produits pour transformer votre quotidien. 
              {!user && " Connectez-vous pour une expérience personnalisée."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                onClick={() => navigate("/products")}
              >
                Explorer la Collection
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              {!user && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => navigate("/login")}
                >
                  Créer un Compte Gratuit
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border/40">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="mx-auto h-8 w-8 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-6 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Produits en Vedette</h2>
            <p className="text-xl text-muted-foreground">Découvrez notre sélection exclusive</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/products")}
            >
              Voir Tous les Produits
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section - Only show for non-logged in users */}
      {!user && (
        <section className="py-20 bg-gradient-to-r from-primary to-primary-glow">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-primary-foreground mb-6">
              Prêt à Commencer ?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Créez votre compte et profitez d'avantages exclusifs
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6"
              onClick={() => navigate("/login")}
            >
              Créer un Compte
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
