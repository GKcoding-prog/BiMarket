import { useState, useEffect } from "react";
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
  Eye,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Get tab from URL or default to "overview"
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  
  // State for real data
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Update active tab when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      const { data, error } = await apiClient.getOrders();
      if (data && !error) {
        console.log('📦 Orders fetched:', data);
        setOrders(data);
      } else {
        console.error('❌ Failed to fetch orders:', error);
      }
      setOrdersLoading(false);
    };

    const fetchWishlist = async () => {
      setLoading(true);
      const { data, error } = await apiClient.getWishlist();
      if (data && !error) {
        console.log('💜 Wishlist fetched:', data);
        setWishlistItems(data.items || []);
      } else {
        console.error('❌ Failed to fetch wishlist:', error);
      }
      setLoading(false);
    };

    fetchOrders();
    fetchWishlist();
  }, []);

  // Calculate real stats from orders
  const totalOrders = orders.length;
  const ordersInDelivery = orders.filter(o => o.status === 'en_cours').length;
  const wishlistCount = wishlistItems.length; // Use actual wishlist items

  const stats = [
    { 
      icon: ShoppingBag, 
      label: "Commandes totales", 
      value: totalOrders.toString(),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      icon: Package, 
      label: "En livraison", 
      value: ordersInDelivery.toString(),
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
    { 
      icon: Heart, 
      label: "Liste de souhaits", 
      value: wishlistCount.toString(),
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

  // Format real orders for display
  const recentOrders = orders.slice(0, 5).map((order: any) => {
    const firstItem = order.items?.[0];
    return {
      id: order.id,
      date: new Date(order.created_at).toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }),
      items: order.items?.length || 0,
      total: parseFloat(order.total_amount || 0),
      status: order.status,
      image: firstItem?.product?.image_url || firstItem?.product?.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100"
    };
  });

  // Use real wishlist items
  const wishlist = wishlistItems.map((item: any) => ({
    id: item.id,
    productId: item.product?.id,
    name: item.product?.name,
    price: parseFloat(item.product?.price || 0),
    image: item.product?.image_url || item.product?.image || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100",
    inStock: (item.product?.stock || 0) > 0
  }));

  const handleRemoveFromWishlist = async (productId: string) => {
    const { error } = await apiClient.removeFromWishlist(productId);
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de retirer le produit",
        variant: "destructive",
      });
    } else {
      // Refresh wishlist
      const { data } = await apiClient.getWishlist();
      if (data) {
        setWishlistItems(data.items || []);
      }
      toast({
        title: "Produit retiré",
        description: "Le produit a été retiré de vos favoris",
      });
    }
  };

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune commande pour le moment</p>
                    <Button onClick={() => navigate('/products')} className="mt-4">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Commencer mes achats
                    </Button>
                  </div>
                ) : (
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
                            <p className="font-semibold text-sm text-muted-foreground">
                              Commande #{order.id.slice(0, 8)}
                            </p>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {order.date} • {order.items} article{order.items > 1 ? 's' : ''}
                          </p>
                          <p className="font-bold text-lg">{formatCurrency(order.total)}</p>
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
                )}
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
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : wishlist.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Heart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Votre liste de souhaits est vide</h3>
                    <p className="text-sm mb-6">
                      Explorez nos produits et ajoutez vos favoris en cliquant sur l'icône ❤️
                    </p>
                    <Button onClick={() => navigate('/products')}>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Découvrir les produits
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleRemoveFromWishlist(item.productId)}
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </Button>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <p className="font-semibold mb-2">{item.name}</p>
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-bold text-primary">{formatCurrency(item.price)}</p>
                          <Badge variant={item.inStock ? "default" : "secondary"}>
                            {item.inStock ? "En stock" : "Rupture"}
                          </Badge>
                        </div>
                        <Button 
                          className="w-full" 
                          size="sm" 
                          disabled={!item.inStock}
                          onClick={() => navigate('/products')}
                        >
                          <ShoppingBag className="h-4 w-4 mr-1" />
                          Voir le produit
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
