import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "Audio", count: 15, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", color: "from-purple-500 to-purple-700" },
    { name: "Tech", count: 24, image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500", color: "from-blue-500 to-blue-700" },
    { name: "Mode", count: 32, image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500", color: "from-pink-500 to-pink-700" },
    { name: "Chaussures", count: 18, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", color: "from-orange-500 to-orange-700" },
    { name: "Photo", count: 12, image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500", color: "from-green-500 to-green-700" },
    { name: "Gaming", count: 21, image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500", color: "from-red-500 to-red-700" },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Catégories</h1>
          <p className="text-xl text-muted-foreground">Explorez nos différentes catégories de produits</p>
        </div>

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
      </div>
    </div>
  );
};

export default Categories;
