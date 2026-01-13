import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingListItemComponent } from "@/components/shopping/ShoppingListItem";
import { useShoppingList } from "@/hooks/useLocalStorage";
import { products, getCheapestStore } from "@/data/mockData";
import { Plus, Trash2, ShoppingCart } from "lucide-react";

const ShoppingList = () => {
  const { items, addItem, removeItem, updateQuantity, toggleChecked, clearChecked } = useShoppingList();
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalEstimate = items.reduce((sum, item) => {
    const cheapest = getCheapestStore(item.productId);
    return sum + (cheapest?.price || 0) * item.quantity;
  }, 0);

  const checkedCount = items.filter((i) => i.isChecked).length;

  return (
    <div className="space-y-4 p-4 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Handleliste</h1>
          <p className="text-muted-foreground">{items.length} varer</p>
        </div>
        {checkedCount > 0 && (
          <Button variant="outline" size="sm" onClick={clearChecked}>
            <Trash2 className="mr-2 h-4 w-4" />
            Fjern avkryssede
          </Button>
        )}
      </header>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Legg til vare</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            placeholder="Søk etter vare..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <div className="max-h-40 overflow-y-auto space-y-1">
              {filteredProducts.slice(0, 5).map((product) => (
                <Button
                  key={product.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    addItem(product.id);
                    setSearch("");
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {product.name}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center text-center">
            <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="font-medium">Handlelisten er tom</p>
            <p className="text-sm text-muted-foreground">Søk og legg til varer ovenfor</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <ShoppingListItemComponent
              key={item.id}
              item={item}
              onToggleChecked={toggleChecked}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>
      )}

      {items.length > 0 && (
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="flex items-center justify-between p-4">
            <span className="font-medium">Estimert total (billigste)</span>
            <span className="text-xl font-bold">€{totalEstimate.toFixed(2)}</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShoppingList;