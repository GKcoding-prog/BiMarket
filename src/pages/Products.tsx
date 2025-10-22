import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  SlidersHorizontal, 
  Grid3X3, 
  List, 
  ArrowUpDown,
  Filter,
  Star,
  TrendingUp,
  Clock
} from "lucide-react";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");

  const products = [
    { 
      id: 1, 
      name: "Casque Audio Premium", 
      price: 199.99, 
      originalPrice: 249.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", 
      category: "Audio",
      rating: 4.8,
      reviews: 234,
      isNew: false,
      isFeatured: true,
      discount: 20
    },
    { 
      id: 2, 
      name: "Montre Connectée Pro", 
      price: 299.99, 
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", 
      category: "Tech",
      rating: 4.9,
      reviews: 456,
      isNew: true,
      isFeatured: true
    },
    { 
      id: 3, 
      name: "Sac à Dos Design", 
      price: 89.99, 
      originalPrice: 129.99,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", 
      category: "Mode",
      rating: 4.6,
      reviews: 189,
      isNew: false,
      isFeatured: false,
      discount: 31
    },
    { 
      id: 4, 
      name: "Sneakers Édition Limitée", 
      price: 149.99, 
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", 
      category: "Chaussures",
      rating: 4.7,
      reviews: 567,
      isNew: false,
      isFeatured: true
    },
    { 
      id: 5, 
      name: "Appareil Photo Mirrorless", 
      price: 1299.99, 
      originalPrice: 1499.99,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500", 
      category: "Photo",
      rating: 4.9,
      reviews: 123,
      isNew: true,
      isFeatured: true,
      discount: 13
    },
    { 
      id: 6, 
      name: "Enceinte Bluetooth", 
      price: 79.99, 
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500", 
      category: "Audio",
      rating: 4.5,
      reviews: 345,
      isNew: false,
      isFeatured: false
    },
    { 
      id: 7, 
      name: "Lunettes de Soleil", 
      price: 129.99, 
      originalPrice: 159.99,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", 
      category: "Accessoires",
      rating: 4.4,
      reviews: 78,
      isNew: false,
      isFeatured: false,
      discount: 19
    },
    { 
      id: 8, 
      name: "Clavier Mécanique RGB", 
      price: 169.99, 
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500", 
      category: "Gaming",
      rating: 4.8,
      reviews: 289,
      isNew: true,
      isFeatured: false
    },
  ];

  const categories = [
    { name: "Tous", count: products.length },
    { name: "Audio", count: products.filter(p => p.category === "Audio").length },
    { name: "Tech", count: products.filter(p => p.category === "Tech").length },
    { name: "Mode", count: products.filter(p => p.category === "Mode").length },
    { name: "Chaussures", count: products.filter(p => p.category === "Chaussures").length },
    { name: "Photo", count: products.filter(p => p.category === "Photo").length },
    { name: "Gaming", count: products.filter(p => p.category === "Gaming").length },
    { name: "Accessoires", count: products.filter(p => p.category === "Accessoires").length },
  ];
  
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const sortOptions = [
    { value: "featured", label: "Mis en avant", icon: Star },
    { value: "newest", label: "Plus récents", icon: Clock },
    { value: "price-low", label: "Prix croissant", icon: ArrowUpDown },
    { value: "price-high", label: "Prix décroissant", icon: ArrowUpDown },
    { value: "rating", label: "Mieux notés", icon: Star },
    { value: "popular", label: "Plus populaires", icon: TrendingUp },
  ];

  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Apply sorting
  filteredProducts = filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case "featured":
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "popular":
        return (b.reviews || 0) - (a.reviews || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Notre Catalogue</h1>
              <p className="text-xl text-muted-foreground">
                {filteredProducts.length} produits disponibles
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4 space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtres
              </h3>
              
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-3">Catégories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        selectedCategory === category.name
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Filtres rapides</h4>
                <div className="space-y-2">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    Nouveautés
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    En promotion
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    Mieux notés
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6 p-4 bg-card rounded-lg border">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Trier par:</span>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={sortBy === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy(option.value)}
                      className="text-xs"
                    >
                      <option.icon className="h-3 w-3 mr-1" />
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length > 0 ? (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
                  : "space-y-4"
              }>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    {...product} 
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-16 text-center">
                <div className="space-y-4">
                  <div className="mx-auto h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Aucun produit trouvé</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Aucun produit ne correspond à vos critères de recherche. 
                    Essayez de modifier vos filtres ou votre recherche.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("Tous");
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
