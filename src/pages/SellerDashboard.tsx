import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  DollarSign, 
  ShoppingCart, 
  Plus, 
  TrendingUp, 
  BarChart3,
  Users,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - replace with actual API calls
  const stats = [
    { 
      icon: DollarSign, 
      label: "Revenus du mois", 
      value: "2,450.00 €", 
      change: "+12.5%",
      trend: "up",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    { 
      icon: ShoppingCart, 
      label: "Commandes", 
      value: "48", 
      change: "+8",
      trend: "up",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      icon: Package, 
      label: "Produits en stock", 
      value: "127", 
      change: "-3",
      trend: "down",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    { 
      icon: Users, 
      label: "Clients", 
      value: "234", 
      change: "+18",
      trend: "up",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
  ];

  const recentOrders = [
    { id: "CMD-001", customer: "Marie Dubois", amount: 89.99, status: "confirmée", date: "Il y a 2h" },
    { id: "CMD-002", customer: "Jean Martin", amount: 156.50, status: "en_cours", date: "Il y a 5h" },
    { id: "CMD-003", customer: "Sophie Laurent", amount: 234.00, status: "livrée", date: "Hier" },
    { id: "CMD-004", customer: "Pierre Durand", amount: 67.80, status: "en_attente", date: "Hier" },
  ];

  const topProducts = [
    { id: 1, name: "Casque Audio Premium", sold: 45, revenue: 8995.50, stock: 12, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100" },
    { id: 2, name: "Montre Connectée Pro", sold: 32, revenue: 9597.68, stock: 8, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100" },
    { id: 3, name: "Sneakers Édition Limitée", sold: 28, revenue: 4199.72, stock: 15, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100" },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      'en_attente': { variant: 'secondary', label: 'En attente' },
      'confirmée': { variant: 'default', label: 'Confirmée' },
      'en_cours': { variant: 'default', label: 'En cours' },
      'livrée': { variant: 'default', label: 'Livrée' },
    };
    const config = statusConfig[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen py-8 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
                <BarChart3 className="h-10 w-10 text-primary" />
                Tableau de Bord Vendeur
              </h1>
              <p className="text-muted-foreground mt-2">
                Bienvenue, {user?.full_name || user?.email} - Gérez votre activité commerciale
              </p>
            </div>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Nouveau Produit
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Commandes Récentes</CardTitle>
                  <Button variant="outline" size="sm">Voir tout</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customer} • {order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-lg">{order.amount.toFixed(2)} €</p>
                          {getStatusBadge(order.status)}
                        </div>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Produits les Plus Vendus</CardTitle>
                  <Button variant="outline" size="sm">Gérer l'inventaire</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.sold} vendus • Stock: {product.stock}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-green-600">{product.revenue.toFixed(2)} €</p>
                        <p className="text-xs text-muted-foreground">Revenus</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Performance des Ventes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <span className="text-sm">Aujourd'hui</span>
                      <span className="font-bold">145.50 €</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <span className="text-sm">Cette semaine</span>
                      <span className="font-bold">892.30 €</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <span className="text-sm">Ce mois</span>
                      <span className="font-bold text-green-600">2,450.00 €</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    Tâches en Attente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-amber-500" />
                      <div className="flex-1">
                        <p className="font-medium">4 commandes à traiter</p>
                        <p className="text-xs text-muted-foreground">Urgence moyenne</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-red-500" />
                      <div className="flex-1">
                        <p className="font-medium">3 produits en rupture</p>
                        <p className="text-xs text-muted-foreground">Action requise</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div className="flex-1">
                        <p className="font-medium">12 nouveaux avis clients</p>
                        <p className="text-xs text-muted-foreground">À modérer</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerDashboard;
