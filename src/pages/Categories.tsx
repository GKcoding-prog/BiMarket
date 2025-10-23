import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { Loader2 } from "lucide-react";

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Gradient colors for categories
  const gradientColors = [
    "from-purple-500 to-purple-700",
    "from-blue-500 to-blue-700",
    "from-pink-500 to-pink-700",
    "from-orange-500 to-orange-700",
    "from-green-500 to-green-700",
    "from-red-500 to-red-700",
    "from-indigo-500 to-indigo-700",
    "from-yellow-500 to-yellow-700",
    "from-teal-500 to-teal-700",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getProducts()
      ]);

      if (categoriesRes.data && !categoriesRes.error) {
        const cats = categoriesRes.data;
        const prods = productsRes.data || [];
        
        // Calculate product counts per category
        const categoriesWithCounts = cats.map((cat: any, index: number) => {
          // Count products that belong to this category
          const count = prods.filter((p: any) => {
            const productCatId = typeof p.category === 'object' 
              ? p.category?.id 
              : p.category;
            return productCatId === cat.id;
          }).length;
          
          return {
            ...cat,
            count,
            color: gradientColors[index % gradientColors.length],
            image: cat.image_url || cat.image || "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500"
          };
        });
        
        console.log('📊 Categories with counts:', categoriesWithCounts);
        
        setCategories(categoriesWithCounts);
        setProducts(prods);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Catégories</h1>
          <p className="text-xl text-muted-foreground">Explorez nos différentes catégories de produits</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">Aucune catégorie disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
            <Card 
              key={category.name}
              className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate("/products")}
            >
              <div className="relative h-48 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                <img 
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-3xl font-bold mb-2">{category.name}</h3>
                  <p className="text-lg opacity-90">{category.count} produits</p>
                </div>
              </div>
            </Card>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
