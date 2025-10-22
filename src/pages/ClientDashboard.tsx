import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  ShoppingBag, 
  Heart, 
  User, 
  MapPin,
  CreditCard,
  Settings,
  Bell,
  Gift,
  Star,
  Truck,
  Eye
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data
  const stats = [
    { 
      icon: ShoppingBag, 
      label: "Commandes totales", 
      value: "24",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      icon: Package, 
      label: "En livraison", 
      value: "3",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
    { 
      icon: Heart, 
      label: "Liste de souhaits", 
      value: "12",
      color: "text-rose-500",
      bgColor: "bg-rose-500/10"
    },
    { 
      icon: Gift, 
      label: "Points fidélité", 
      value: "450",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
  ];

  const recentOrders = [
    { 
      id: "CMD-5678", 
      date: "22 Oct 2025", 
      items: 3, 
      total: 234.50, 
      status: "livrée",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100"
    },
    { 
      id: "CMD-5679", 
      date: "20 Oct 2025", 
      items: 1, 
      total: 89.99, 
      status: "en_cours",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"
    },
    { 
      id: "CMD-5680", 
      date: "18 Oct 2025", 
      items: 2, 
      total: 156.00, 
      status: "en_attente",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100"
    },
  ];

  const wishlist = [
    { id: 1, name: "Sac à Dos Design", price: 89.99, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100", inStock: true },
    { id: 2, name: "Lunettes de Soleil", price: 129.99, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100", inStock: true },
    { id: 3, name: "Clavier Mécanique RGB", price: 169.99, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=100", inStock: false },
  ];

  const addresses = [
    { id: 1, label: "Domicile", address: "123 Rue de la Paix", city: "Paris 75001", isDefault: true },
    { id: 2, label: "Bureau", address: "456 Avenue des Champs", city: "Lyon 69001", isDefault: false },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { className: string; label: string }> = {
      'en_attente': { className: 'bg-yellow-500/10 text-yellow-700 border-yellow-200', label: 'En attente' },
      'confirmée': { className: 'bg-blue-500/10 text-blue-700 border-blue-200', label: 'Confirmée' },
      'en_cours': { className: 'bg-purple-500/10 text-purple-700 border-purple-200', label: 'En cours' },
      'livrée': { className: 'bg-green-500/10 text-green-700 border-green-200', label: 'Livrée' },
    };
    const config = statusConfig[status] || { className: '', label: status };
    return <Badge className={config.className}>{config.label}</Badge>;
  };


  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
                <User className="h-10 w-10 text-primary" />
                Mon Compte
              </h1>
              <p className="text-muted-foreground mt-2">
                Bienvenue, {user?.full_name || user?.email}
              </p>
            </div>
            <Button onClick={() => navigate('/products')} size="lg">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Continuer mes achats
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
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
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="wishlist">Favoris</TabsTrigger>
            <TabsTrigger value="addresses">Adresses</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes Commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <img 
                        src={order.image} 
                        alt="Order" 
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold">{order.id}</p>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {order.date} • {order.items} article{order.items > 1 ? 's' : ''}
                        </p>
                        <p className="font-bold text-lg">{order.total.toFixed(2)} €</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        {order.status === 'en_cours' && (
                          <Button variant="outline" size="sm">
                            <Truck className="h-4 w-4 mr-1" />
                            Suivre
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Ma Liste de Souhaits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <p className="font-semibold mb-2">{item.name}</p>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-primary">{item.price.toFixed(2)} €</p>
                        <Badge variant={item.inStock ? "default" : "secondary"}>
                          {item.inStock ? "En stock" : "Rupture"}
                        </Badge>
                      </div>
                      <Button className="w-full mt-3" size="sm" disabled={!item.inStock}>
                        <ShoppingBag className="h-4 w-4 mr-1" />
                        Ajouter au panier
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Mes Adresses
                  </CardTitle>
                  <Button size="sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold">{addr.label}</p>
                        {addr.isDefault && (
                          <Badge variant="default">Par défaut</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{addr.address}</p>
                      <p className="text-sm text-muted-foreground mb-3">{addr.city}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Informations Personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nom complet</p>
                    <p className="font-semibold">{user?.full_name || "Non renseigné"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-semibold">{user?.email}</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Modifier mes informations
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Paramètres
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Méthodes de paiement
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Programme fidélité
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Préférences
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;
