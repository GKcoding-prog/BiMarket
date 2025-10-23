import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Eye, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  id: number;
  name: string;
  price: number | string;
  originalPrice?: number | string;
  image: string;
  category: string | { id: string; name: string } | any;  // Can be string or object
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
  viewMode?: "grid" | "list";
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  originalPrice,
  image, 
  category,
  rating = 4.5,
  reviews = 0,
  isNew = false,
  isFeatured = false,
  discount,
  viewMode = "grid"
}: ProductCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  // Convert price to number safely
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  const numOriginalPrice = originalPrice ? (typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice) : undefined;
  
  // Get category name - handle both string and object
  const categoryName = typeof category === 'string' 
    ? category 
    : (category?.name || 'Non catégorisé');
  
  // Check if product is in wishlist on mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (user) {
        const { data } = await apiClient.checkWishlist(id.toString());
        if (data) {
          setIsInWishlist(data.in_wishlist);
        }
      }
    };
    checkWishlistStatus();
  }, [user, id]);
  
  const handleImageError = () => {
    console.warn(`⚠️ Failed to load image for product "${name}":`, image);
  };

  const handleAddToCart = async () => {
    if (!user) {
      // Store the product they wanted to add and redirect to login
      sessionStorage.setItem('pendingCartItem', JSON.stringify({ id, name, price }));
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des produits au panier",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsAdding(true);
    try {
      console.log(`🛒 Adding product to cart:`, { id, name, quantity: 1 });
      
      const { error } = await apiClient.addToCart(id.toString(), 1);
      
      if (error) {
        console.error('❌ Failed to add to cart:', error);
        toast({
          title: "Erreur",
          description: error || "Impossible d'ajouter le produit au panier",
          variant: "destructive",
        });
      } else {
        console.log('✅ Product added to cart successfully');
        toast({
          title: "Produit ajouté ! 🛒",
          description: `${name} a été ajouté à votre panier`,
        });
      }
    } catch (error) {
      console.error('❌ Exception while adding to cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter à vos favoris",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setWishlistLoading(true);
    try {
      const { data, error } = await apiClient.toggleWishlist(id.toString());
      
      if (error) {
        console.error('❌ Wishlist toggle failed:', error);
        toast({
          title: "Erreur",
          description: error || "Impossible de modifier vos favoris",
          variant: "destructive",
        });
      } else {
        const inWishlist = data?.in_wishlist;
        setIsInWishlist(inWishlist);
        
        toast({
          title: inWishlist ? "Ajouté aux favoris ! 💜" : "Retiré des favoris",
          description: inWishlist 
            ? `${name} a été ajouté à vos favoris`
            : `${name} a été retiré de vos favoris`,
        });
      }
    } catch (error) {
      console.error('❌ Exception in wishlist:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier vos favoris",
        variant: "destructive",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleQuickView = () => {
    // TODO: Implement quick view modal or navigate to product details
    navigate(`/products/${id}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
        <div className="flex p-4">
          {/* Image */}
          <div className="relative w-32 h-32 flex-shrink-0 mr-4">
            <img 
              src={image} 
              alt={name}
              className="object-cover w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 space-y-1">
              {isNew && (
                <Badge className="bg-blue-500 text-white text-xs">
                  Nouveau
                </Badge>
              )}
              {discount && (
                <Badge className="bg-red-500 text-white text-xs">
                  -{discount}%
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  className={`transition-colors ${
                    isInWishlist 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-muted-foreground hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              <Badge variant="outline" className="mb-2 text-xs">
                {categoryName}
              </Badge>

              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  {renderStars(rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {rating} ({reviews} avis)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(numPrice)}
                </span>
                {numOriginalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(numOriginalPrice)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleQuickView}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Voir
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  {isAdding ? "..." : "Ajouter"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300 animate-fade-in hover:border-primary/20">
      <div className="relative overflow-hidden aspect-square">
        <img 
          src={image} 
          alt={name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          onError={handleImageError}
        />
        
        {/* Action Buttons Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          <Button 
            variant="secondary" 
            size="icon"
            onClick={handleQuickView}
            className="bg-background/90 backdrop-blur-sm hover:bg-background"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon"
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className={`bg-background/90 backdrop-blur-sm hover:bg-background transition-all ${
              isInWishlist ? 'text-red-500' : ''
            }`}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {isNew && (
            <Badge className="bg-blue-500 text-white text-xs">
              Nouveau
            </Badge>
          )}
          {isFeatured && (
            <Badge className="bg-purple-500 text-white text-xs">
              ⭐ Vedette
            </Badge>
          )}
        </div>

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md">
            -{discount}%
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium rounded-md">
          {categoryName}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        <div className="flex items-center space-x-1 mb-2">
          {renderStars(rating)}
          <span className="text-xs text-muted-foreground ml-1">
            ({reviews})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-xl font-bold text-primary">{formatCurrency(numPrice)}</p>
            {numOriginalPrice && (
              <p className="text-sm text-muted-foreground line-through">
                {formatCurrency(numOriginalPrice)}
              </p>
            )}
          </div>
          {discount && (
            <Badge variant="destructive" className="text-xs">
              -{discount}%
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" 
          size="lg"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          <ShoppingCart className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
          {isAdding ? "Ajout..." : "Ajouter au panier"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
