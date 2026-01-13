import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Offer } from "@/types";
import { getProductById, getStoreById } from "@/data/mockData";

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  return null;

  const product = getProductById(offer.productId);
  const store = getStoreById(offer.storeId);

  if (!product || !store) return null;

  const discount = Math.round(
    ((offer.originalPrice - offer.salePrice) / offer.originalPrice) * 100
  );

  const validTo = new Date(offer.validTo);
  const today = new Date();
  const daysLeft = Math.ceil(
    (validTo.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">{store.logo}</span>
              <span className="text-sm font-medium text-muted-foreground">
                {store.name}
              </span>
            </div>
            <h3 className="font-semibold">{product.name}</h3>
            {offer.description && (
              <p className="text-sm text-muted-foreground">{offer.description}</p>
            )}
          </div>
          <div className="text-right">
            <Badge variant="destructive" className="mb-1">
              -{discount}%
            </Badge>
            <div className="space-y-0.5">
              <p className="text-lg font-bold text-primary">
                €{offer.salePrice.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground line-through">
                €{offer.originalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t pt-3">
          <span className="text-xs text-muted-foreground">
            Gyldig til {validTo.toLocaleDateString("de-DE")}
          </span>
          {daysLeft <= 3 && (
            <Badge variant="outline" className="text-warning border-warning">
              {daysLeft === 1 ? "Siste dag!" : `${daysLeft} dager igjen`}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}