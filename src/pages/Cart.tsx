import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'lumicash' | 'ecocash'>('lumicash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    const { data, error } = await apiClient.getCart();
    if (data && !error) {
      setCartItems(data.items || []);
    } else {
      console.error('Error fetching cart:', error);
      // If cart endpoint doesn't exist or fails, show empty cart
      setCartItems([]);
    }
    setLoading(false);
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const { error } = await apiClient.updateCartItem(itemId, newQuantity);
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité",
        variant: "destructive",
      });
    } else {
      fetchCart(); // Refresh cart
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    const { error } = await apiClient.removeFromCart(itemId);
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Article supprimé",
        description: "L'article a été retiré du panier",
      });
      fetchCart(); // Refresh cart
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    // Handle price from different possible locations
    const rawPrice = item.price || item.product?.price || item.unit_price || 0;
    const price = typeof rawPrice === 'string' ? parseFloat(rawPrice) : rawPrice;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);
  const shipping = subtotal > 50000 ? 0 : 5000; // Free shipping over 50,000 FBu
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setShowPaymentDialog(true);
  };

  const handleInitiatePayment = async () => {
    // Validate phone number
    if (!phoneNumber || phoneNumber.length !== 8) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un numéro de téléphone valide (8 chiffres)",
        variant: "destructive",
      });
      return;
    }

    if (!phoneNumber.startsWith('79') && !phoneNumber.startsWith('71') && 
        !phoneNumber.startsWith('76') && !phoneNumber.startsWith('77')) {
      toast({
        title: "Erreur",
        description: "Le numéro doit commencer par 79, 71, 76 ou 77",
        variant: "destructive",
      });
      return;
    }

    // Validate shipping address
    if (!shippingAddress || shippingAddress.trim().length < 10) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse de livraison complète",
        variant: "destructive",
      });
      return;
    }

    setProcessingPayment(true);

    try {
      // First, create an order (it uses cart items automatically)
      console.log('📦 Creating order with data:', {
        shipping_address: shippingAddress
      });
      
      const { data: orderData, error: orderError } = await apiClient.createOrder({
        shipping_address: shippingAddress
      });

      if (orderError || !orderData) {
        console.error('❌ Order creation failed:', orderError);
        throw new Error(orderError || 'Failed to create order');
      }

      console.log('✅ Order created successfully:', orderData);

      // Then initiate payment
      console.log('💳 Initiating payment with data:', {
        order_id: orderData.id,
        payment_method: paymentMethod,
        phone_number: phoneNumber
      });
      
      const { data: paymentData, error: paymentError } = await apiClient.initiatePayment({
        order_id: orderData.id,
        payment_method: paymentMethod,
        phone_number: phoneNumber
      });

      if (paymentError || !paymentData) {
        console.error('❌ Payment initiation failed:', paymentError);
        throw new Error(paymentError || 'Failed to initiate payment');
      }

      console.log('✅ Payment initiated successfully:', paymentData);

      toast({
        title: "Paiement initié ! 💳",
        description: paymentData.message || "Veuillez confirmer sur votre téléphone",
      });

      setShowPaymentDialog(false);
      
      // Navigate to order confirmation or payment status page
      setTimeout(() => {
        navigate(`/orders/${orderData.id}`);
      }, 2000);

    } catch (error: any) {
      console.error('❌ Payment error:', error);
      
      // Extract detailed error message
      let errorMessage = "Impossible d'initier le paiement";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur de paiement",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-8">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                </CardContent>
              </Card>
            ) : cartItems.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Votre panier est vide</h3>
                  <p className="text-muted-foreground mb-6">Commencez vos achats maintenant</p>
                  <Button onClick={() => navigate("/products")}>
                    Explorer les Produits
                  </Button>
                </CardContent>
              </Card>
            ) : (
              cartItems.map((item) => {
                // Handle price from different possible locations in the response
                const rawPrice = item.price || item.product?.price || item.unit_price || 0;
                const itemPrice = typeof rawPrice === 'string' ? parseFloat(rawPrice) : rawPrice;
                const itemImage = item.image_url || item.image || item.product?.image_url || item.product?.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200";
                const itemName = item.name || item.product?.name || 'Produit';
                
                console.log('🛒 Cart item:', { item, itemPrice, rawPrice });
                
                return (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img 
                          src={itemImage} 
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{itemName}</h3>
                          <p className="text-2xl font-bold text-primary mb-4">{formatCurrency(itemPrice)}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 border border-border rounded">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Résumé de la Commande</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Sous-total</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Livraison</span>
                    <span>{shipping === 0 ? 'GRATUITE' : formatCurrency(shipping)}</span>
                  </div>
                  {subtotal < 50000 && subtotal > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Livraison gratuite dès 50,000 FBu d'achat
                    </p>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={cartItems.length === 0}
                  onClick={handleCheckout}
                >
                  Passer la Commande
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate("/products")}
                >
                  Continuer mes Achats
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Finaliser le paiement</DialogTitle>
              <DialogDescription>
                Choisissez votre méthode de paiement et entrez votre numéro de téléphone
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {/* Payment Method Selection */}
              <div className="space-y-3">
                <Label>Méthode de paiement</Label>
                <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="lumicash" id="lumicash" />
                    <Label htmlFor="lumicash" className="flex-1 cursor-pointer">
                      <div className="font-semibold">LumiCash</div>
                      <div className="text-xs text-muted-foreground">Paiement mobile LumiCash</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="ecocash" id="ecocash" />
                    <Label htmlFor="ecocash" className="flex-1 cursor-pointer">
                      <div className="font-semibold">EcoCash</div>
                      <div className="text-xs text-muted-foreground">Paiement mobile EcoCash</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Phone Number Input */}
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  placeholder="79123456"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={8}
                  type="tel"
                />
                <p className="text-xs text-muted-foreground">
                  Format: 79XXXXXX, 71XXXXXX, 76XXXXXX ou 77XXXXXX
                </p>
              </div>

              {/* Shipping Address Input */}
              <div className="space-y-2">
                <Label htmlFor="address">Adresse de livraison</Label>
                <Input
                  id="address"
                  placeholder="Ex: Avenue de la Liberté, Quartier Rohero, Bujumbura"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  type="text"
                />
                <p className="text-xs text-muted-foreground">
                  Entrez une adresse complète pour la livraison
                </p>
              </div>

              {/* Order Summary */}
              <div className="border border-border rounded-lg p-3 bg-accent/50">
                <div className="flex justify-between text-sm mb-2">
                  <span>Sous-total:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Livraison:</span>
                  <span>{shipping === 0 ? 'GRATUITE' : formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-primary pt-2 border-t border-border">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowPaymentDialog(false)}
                disabled={processingPayment}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleInitiatePayment}
                disabled={processingPayment || !phoneNumber || !shippingAddress}
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  'Confirmer le paiement'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Cart;
