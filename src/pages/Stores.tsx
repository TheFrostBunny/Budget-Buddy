import { StoreCard } from "@/components/stores/StoreCard";
import { usePreferences } from "@/hooks/useLocalStorage";
import { stores } from "@/data/mockData";
import { useState } from "react";

// Eksempelkoordinater for butikker i Hamburg
const storeLocations = {
  rewe: { lat: 53.5587, lon: 9.9278 },
  edeka: { lat: 53.5654, lon: 10.0014 },
  lidl: { lat: 53.5511, lon: 9.9937 },
  aldi: { lat: 53.5734, lon: 10.0153 },
  penny: { lat: 53.5566, lon: 9.9916 },
  netto: { lat: 53.5792, lon: 9.9731 },
};

const Stores = () => {
  const { preferences, toggleFavoriteStore } = usePreferences();
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const sortedStores = [...stores].sort((a, b) => {
    const aFav = preferences.favoriteStores.includes(a.id);
    const bFav = preferences.favoriteStores.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  return (
    <div className="space-y-4 p-4 pt-6">
      <header>
        <h1 className="text-2xl font-bold">Matbutikker i Hamburg</h1>
        <p className="text-muted-foreground">Se oversikt og kart over butikker</p>
      </header>
      <div className="mb-6">
        <iframe
          title="Hamburg Supermarkets Map"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=9.8,53.5,10.2,53.7&layer=mapnik`}
          className="w-full h-64 rounded border"
          loading="lazy"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(storeLocations).map(([id, loc]) => (
            <a
              key={id}
              href={`https://www.openstreetmap.org/?mlat=${loc.lat}&mlon=${loc.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline text-primary"
            >
              {stores.find(s => s.id === id)?.name}
            </a>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {sortedStores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            isFavorite={preferences.favoriteStores.includes(store.id)}
            onToggleFavorite={toggleFavoriteStore}
            onClick={() => setSelectedStore(store.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Stores;