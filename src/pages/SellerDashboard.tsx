import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
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
  CheckCircle2,
  FolderTree,
  Save,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { useEffect } from "react";

const SellerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dialog states
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: ""
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: ""
  });

  // Real data from backend
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchSellerOrders();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await apiClient.getCategories();
    console.log('📁 Fetched categories:', data, 'Error:', error);
    if (data && !error) {
      setCategories(data);
      console.log('✅ Categories set to state:', data);
    }
  };

  const fetchSellerOrders = async () => {
    const { data, error } = await apiClient.getSellerOrders();
    console.log('📦 Fetched seller orders:', data, 'Error:', error);
    if (data && !error) {
      setSellerOrders(data);
      console.log('✅ Seller orders set to state:', data);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await apiClient.getProducts();
    if (data && !error) {
      setProducts(data);
      // Update category product counts
      const counts = data.reduce((acc: any, product: any) => {
        // Handle category as object or string
        const catId = typeof product.category === 'object' 
          ? product.category?.id 
          : product.category;
        
        if (catId) {
          acc[catId] = (acc[catId] || 0) + 1;
        }
        return acc;
      }, {});
      
      console.log('📊 Category product counts:', counts);
      
      setCategories(prev => prev.map(cat => ({
        ...cat,
        productCount: counts[cat.id] || 0
      })));
    }
    setLoading(false);
  };

  // Calculate real stats from products and orders
  const totalProducts = products.length;
  const productsInStock = products.filter(p => (p.stock || 0) > 0).length;
  
  // Calculate revenue from seller orders
  const totalRevenue = sellerOrders.reduce((sum, order) => {
    return sum + parseFloat(order.total_amount || 0);
  }, 0);
  
  const totalOrders = sellerOrders.length;
  
  // Get unique customers from orders
  const uniqueCustomers = new Set(sellerOrders.map(order => order.user?.id || order.user)).size;

  const stats = [
    { 
      icon: DollarSign, 
      label: "Revenus du mois", 
      value: formatCurrency(totalRevenue), 
      change: `${totalOrders} commandes`,
      trend: "up",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    { 
      icon: ShoppingCart, 
      label: "Commandes", 
      value: totalOrders.toString(), 
      change: sellerOrders.filter(o => o.status === 'en_cours').length + " en cours",
      trend: "up",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      icon: Package, 
      label: "Produits en stock", 
      value: productsInStock.toString(), 
      change: `${totalProducts} total`,
      trend: "up",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    { 
      icon: Users, 
      label: "Clients", 
      value: uniqueCustomers.toString(), 
      change: "clients uniques",
      trend: "up",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
  ];

  // Format real orders for display
  const recentOrders = sellerOrders.slice(0, 5).map((order: any) => ({
    id: order.id.slice(0, 8),
    customer: order.user?.full_name || order.user?.email || "Client",
    amount: parseFloat(order.total_amount || 0),
    status: order.status,
    date: new Date(order.created_at).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }));

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

  // Product handlers
  const handleAddProduct = async () => {
    console.log('🚀 handleAddProduct called!');
    console.log('📋 Current form state:', productForm);
    
    // Validate required fields
    if (!productForm.name || !productForm.price || !productForm.stock || !productForm.category) {
      console.log('❌ Validation failed - missing fields');
      toast({
        title: "Champs requis manquants ⚠️",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }
    
    console.log('✅ Validation passed');
    
    const productData = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
      category_id: productForm.category || null,  // Try category_id instead of category
      image_url: productForm.image || null  // Use the URL from form
    };
    
    console.log('📤 Creating product with data:', productData);
    console.log('📤 Category value:', productForm.category, 'Type:', typeof productForm.category);
    
    try {
      const { data, error } = await apiClient.createProduct(productData);
      
      console.log('📝 Create product response:', { data, error });
      
      if (error) {
        toast({
          title: "Erreur ❌",
          description: `Impossible d'ajouter le produit: ${error}`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Produit ajouté ! ✅",
        description: `${productForm.name} a été ajouté à votre catalogue`,
      });
      setIsAddProductOpen(false);
      setProductForm({ name: "", description: "", price: "", stock: "", category: "", image: "" });
      fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('❌ Error adding product:', err);
      toast({
        title: "Erreur ❌",
        description: "Une erreur s'est produite lors de l'ajout du produit",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    
    // Extract category ID properly - handle both object and string
    const categoryId = typeof product.category === 'object' 
      ? product.category?.id 
      : product.category;
    
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: categoryId || "",
      image: product.image_url || ""  // Backend uses image_url
    });
    
    console.log('✏️ Editing product:', product.name, 'Category ID:', categoryId);
    
    setIsEditProductOpen(true);
  };

  const handleUpdateProduct = async () => {
    console.log('🔧 Starting product update...');
    console.log('📋 Form state:', productForm);
    console.log('🎯 Selected product:', selectedProduct);
    
    const productData = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
      category_id: productForm.category || null,  // Send category_id
      image_url: productForm.image || null  // Use the URL from form
    };
    
    console.log('📤 Updating product:', selectedProduct.id, 'with data:', productData);
    
    try {
      const { data, error } = await apiClient.updateProduct(selectedProduct.id, productData);
      
      console.log('📝 Update product response:', { data, error });
      
      if (error) {
        console.error('❌ Update failed:', error);
        
        // Check if it's a permissions error
        if (error.includes('permission')) {
          toast({
            title: "Erreur de permissions ❌",
            description: "Vous n'avez pas la permission de modifier ce produit. Seul le vendeur qui a creer ce produit a droit de le modifier.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur ❌",
            description: `Impossible de modifier le produit: ${error}`,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Produit modifié ! ✅",
        description: "Les modifications ont été enregistrées",
      });
      setIsEditProductOpen(false);
      setProductForm({ name: "", description: "", price: "", stock: "", category: "", image: "" });
      fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('❌ Error updating product:', err);
      toast({
        title: "Erreur ❌",
        description: "Une erreur s'est produite lors de la modification",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    console.log('📤 Deleting product:', productId);
    
    const { data, error } = await apiClient.deleteProduct(productId.toString());
    
    console.log('📝 Delete product response:', { data, error });
    
    if (error) {
      toast({
        title: "Erreur ❌",
        description: `Impossible de supprimer le produit: ${error}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Produit supprimé ! 🗑️",
      description: "Le produit a été retiré du catalogue",
    });
    fetchProducts(); // Refresh the list
  };

  // Category handlers
  const handleAddCategory = async () => {
    const { data, error } = await apiClient.createCategory({
      name: categoryForm.name,
      description: categoryForm.description
    });
    
    if (error) {
      toast({
        title: "Erreur ❌",
        description: "Impossible d'ajouter la catégorie",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Catégorie ajoutée ! ✅",
      description: `${categoryForm.name} a été ajoutée`,
    });
    setIsAddCategoryOpen(false);
    setCategoryForm({ name: "", description: "" });
    fetchCategories(); // Refresh the list
  };

  const handleDeleteCategory = async (categoryId: number) => {
    const { data, error } = await apiClient.deleteCategory(categoryId.toString());
    
    if (error) {
      toast({
        title: "Erreur ❌",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Catégorie supprimée ! 🗑️",
      description: "La catégorie a été supprimée",
    });
    fetchCategories(); // Refresh the list
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
            <div className="flex gap-2">
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Nouveau Produit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Ajouter un Nouveau Produit</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations du produit ci-dessous
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nom du produit *</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        placeholder="Ex: Casque Audio Premium"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        placeholder="Décrivez votre produit..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="price">Prix (FBu) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                          placeholder="50000"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="stock">Stock *</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                          placeholder="50"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Catégorie *</Label>
                      <Select 
                        value={productForm.category} 
                        onValueChange={(value) => {
                          console.log('🔄 Category selected:', value);
                          setProductForm({...productForm, category: value});
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length === 0 ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              Aucune catégorie disponible
                            </div>
                          ) : (
                            categories.map((cat) => {
                              console.log('🏷️ Rendering category option:', cat.id, cat.name);
                              return (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              );
                            })
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="image">URL de l'image</Label>
                      <Input
                        id="image"
                        value={productForm.image}
                        onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-xs text-muted-foreground">
                        Entrez une URL d'image (ex: depuis Unsplash, Imgur, etc.)
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button onClick={handleAddProduct}>
                      <Save className="h-4 w-4 mr-2" />
                      Ajouter le produit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="gap-2">
                    <FolderTree className="h-5 w-5" />
                    Nouvelle Catégorie
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter une Catégorie</DialogTitle>
                    <DialogDescription>
                      Créez une nouvelle catégorie pour organiser vos produits
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cat-name">Nom de la catégorie *</Label>
                      <Input
                        id="cat-name"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                        placeholder="Ex: Électronique"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cat-desc">Description</Label>
                      <Textarea
                        id="cat-desc"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                        placeholder="Description de la catégorie..."
                        rows={2}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddCategory}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
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

        {/* Edit Product Dialog */}
        <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le Produit</DialogTitle>
              <DialogDescription>
                Mettez à jour les informations du produit
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nom du produit *</Label>
                <Input
                  id="edit-name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Prix (FBu) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-stock">Stock *</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Catégorie *</Label>
                <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">URL de l'image</Label>
                <Input
                  id="edit-image"
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Entrez une URL d'image (ex: depuis Unsplash, Imgur, etc.)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditProductOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button onClick={handleUpdateProduct}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
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
                          <p className="font-bold text-lg">{formatCurrency(order.amount)}</p>
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
                  <CardTitle>Mes Produits</CardTitle>
                  <Button variant="outline" size="sm">Gérer l'inventaire</Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun produit pour le moment</p>
                    <p className="text-sm mt-2">Cliquez sur "Nouveau Produit" pour commencer</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                        <img 
                          src={product.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100"} 
                          alt={product.name} 
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Stock: {product.stock || 0}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-green-600">{formatCurrency(parseFloat(product.price || 0))}</p>
                          <p className="text-xs text-muted-foreground">Prix</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FolderTree className="h-5 w-5 text-primary" />
                    Gérer les Catégories
                  </CardTitle>
                  <Button onClick={() => setIsAddCategoryOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderTree className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune catégorie pour le moment</p>
                    <p className="text-sm mt-2">Cliquez sur "Nouvelle Catégorie" pour commencer</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <div key={category.id} className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {category.productCount || 0} produit{(category.productCount || 0) !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <Badge variant="secondary">{category.productCount || 0}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-3 w-3 mr-1" />
                            Modifier
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                      <span className="text-sm">Total des revenus</span>
                      <span className="font-bold text-green-600">{formatCurrency(totalRevenue)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <span className="text-sm">Commandes confirmées</span>
                      <span className="font-bold">{sellerOrders.filter(o => o.status === 'confirmée').length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <span className="text-sm">Commandes livrées</span>
                      <span className="font-bold">{sellerOrders.filter(o => o.status === 'livrée').length}</span>
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
                        <p className="font-medium">{sellerOrders.filter(o => o.status === 'en_attente').length} commandes à traiter</p>
                        <p className="text-xs text-muted-foreground">Urgence moyenne</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-red-500" />
                      <div className="flex-1">
                        <p className="font-medium">{products.filter(p => (p.stock || 0) === 0).length} produits en rupture</p>
                        <p className="text-xs text-muted-foreground">Action requise</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div className="flex-1">
                        <p className="font-medium">{totalProducts} produits actifs</p>
                        <p className="text-xs text-muted-foreground">En catalogue</p>
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
