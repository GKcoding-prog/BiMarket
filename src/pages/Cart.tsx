import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  // Mock cart items
  const cartItems = [
    { id: 1, name: "Casque Audio Premium", price: 199.99, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" },
    { id: 2, name: "Montre Connectée Pro", price: 299.99, quantity: 2, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-8">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
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
              cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                        <p className="text-2xl font-bold text-primary mb-4">{item.price.toFixed(2)} €</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 border border-border rounded">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
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
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Livraison</span>
                    <span>{shipping.toFixed(2)} €</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{total.toFixed(2)} €</span>
                  </div>
                </div>
                <Button className="w-full" size="lg">
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
      </div>
    </div>
  );
};

export default Cart;
