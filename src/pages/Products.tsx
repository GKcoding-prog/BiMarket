import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { apiClient } from "@/lib/api";
import { Loader2 } from "lucide-react";
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
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await apiClient.getProducts();
    if (data && !error) {
      // Map backend fields to frontend expected fields
      const mappedProducts = data.map((product: any) => ({
        ...product,
        image: product.image_url || product.image, // Map image_url to image
        // Keep category as is (can be object or string)
      }));
      setProducts(mappedProducts);
    } else {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await apiClient.getCategories();
    if (data && !error) {
      setCategories(data);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const sortOptions = [
    { value: "featured", label: "Mis en avant", icon: Star },
    { value: "newest", label: "Plus récents", icon: Clock },
    { value: "price-low", label: "Prix croissant", icon: ArrowUpDown },
    { value: "price-high", label: "Prix décroissant", icon: ArrowUpDown },
    { value: "rating", label: "Mieux notés", icon: Star },
    { value: "popular", label: "Plus populaires", icon: TrendingUp },
  ];

  // Get categories with product counts
  const categoriesWithCounts = [
    { id: null, name: "Tous", count: products.length },
    ...categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      count: products.filter((p: any) => {
        const productCatId = typeof p.category === 'object' ? p.category?.id : p.category;
        return productCatId === cat.id;
      }).length
    }))
  ];

  // Filter products
  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const productCatId = typeof product.category === 'object' ? product.category?.id : product.category;
    const matchesCategory = selectedCategory === null || productCatId === selectedCategory;
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
                {loading ? "Chargement..." : `${filteredProducts.length} produits disponibles`}
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
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtres
                  {selectedCategory && (
                    <Badge variant="secondary" className="ml-2">1</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                  <SheetDescription>
                    Affinez votre recherche de produits
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Search */}
                  <div>
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
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Catégories</h4>
                    <div className="space-y-2">
                      {categoriesWithCounts.map((category) => (
                        <button
                          key={category.id || 'all'}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setMobileFiltersOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                            selectedCategory === category.id
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
                    <div className="flex flex-wrap gap-2">
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
                  
                  {/* Apply Button */}
                  <Button 
                    className="w-full" 
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    Appliquer les filtres
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block lg:w-1/4 space-y-6">
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
                  {categoriesWithCounts.map((category) => (
                    <button
                      key={category.id || 'all'}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
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
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6" 
                  : "space-y-3 sm:space-y-4"
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
                      setSelectedCategory(null);
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
