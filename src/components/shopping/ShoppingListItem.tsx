import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ShoppingListItem as ShoppingListItemType } from "@/types";
import { getProductById, getCheapestStore, getStoreById } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface ShoppingListItemProps {
  item: ShoppingListItemType;
  selectedStoreId?: string;
  onToggleChecked: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function ShoppingListItemComponent({
  item,
  selectedStoreId,
  onToggleChecked,
  onUpdateQuantity,
  onRemove,
}: ShoppingListItemProps) {
  const product = getProductById(item.productId);
  if (!product) return null;

  const cheapest = getCheapestStore(item.productId);
  const cheapestStore = cheapest ? getStoreById(cheapest.storeId) : null;

  // Calculate item price based on selected store or cheapest
  const pricePerUnit = selectedStoreId
    ? (getCheapestStore(item.productId)?.price || 0) // Would need to get specific store price
    : (cheapest?.price || 0);
  const totalPrice = pricePerUnit * item.quantity;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-card p-3 transition-opacity",
        item.isChecked && "opacity-60"
      )}
    >
      <Checkbox
        checked={item.isChecked}
        onCheckedChange={() => onToggleChecked(item.id)}
        className="h-5 w-5"
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-medium truncate",
            item.isChecked && "line-through text-muted-foreground"
          )}
        >
          {product.name}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            €{pricePerUnit.toFixed(2)} / {product.unit}
          </span>
          {cheapestStore && !selectedStoreId && (
            <span className="text-primary">
              Billigst: {cheapestStore.name}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="w-16 text-right">
        <p className="font-semibold">€{totalPrice.toFixed(2)}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}