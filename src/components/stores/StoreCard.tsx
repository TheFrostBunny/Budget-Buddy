import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Store } from "@/types";
import { cn } from "@/lib/utils";

interface StoreCardProps {
  store: Store;
  isFavorite: boolean;
  onToggleFavorite: (storeId: string) => void;
  onClick?: () => void;
}

export function StoreCard({
  store,
  isFavorite,
  onToggleFavorite,
  onClick,
}: StoreCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isFavorite && "ring-2 ring-primary/20"
      )}
      onClick={onClick}
    >
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{store.logo}</span>
          <div>
            <h3 className="font-semibold">{store.name}</h3>
            {store.address && (
              <p className="text-sm text-muted-foreground">{store.address}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(store.id);
          }}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isFavorite ? "fill-primary text-primary" : "text-muted-foreground"
            )}
          />
        </Button>
      </CardContent>
    </Card>
  );
}