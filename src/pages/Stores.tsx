import { usePreferences } from "@/hooks/useLocalStorage";
import { stores } from "@/data/mockData";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Search, Loader2, Locate } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const defaultStoreLocations = {
  rewe: { lat: 53.5522093, lon: 10.0028928 },
  edeka: { lat: 53.5654, lon: 10.0014 },
  lidl: { lat: 53.5511, lon: 9.9937 },
  aldi: { lat: 53.5734, lon: 10.0153 },
  penny: { lat: 53.5566, lon: 9.9916 },
  netto: { lat: 53.5792, lon: 9.9731 },
};

const Stores = () => {
  const { preferences, toggleFavoriteStore, addStoreLocation } = usePreferences();
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const { t } = useTranslation();

  // Form state
  const [isOpen, setIsOpen] = useState(false);
  const [newStoreId, setNewStoreId] = useState("");
  const [newLat, setNewLat] = useState("");
  const [newLon, setNewLon] = useState("");
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  const sortedStores = [...stores].sort((a, b) => {
    const aFav = preferences.favoriteStores.includes(a.id);
    const bFav = preferences.favoriteStores.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  const handleSearchAddress = async () => {
    if (!address) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setNewLat(data[0].lat);
        setNewLon(data[0].lon);
      } else {
        alert(t('stores.notFound'));
      }
    } catch (error) {
      console.error("Geocoding error", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddLocation = () => {
    if (newStoreId && newLat && newLon) {
      addStoreLocation(newStoreId, parseFloat(newLat), parseFloat(newLon));
      setIsOpen(false);
      setNewLat("");
      setNewLon("");
      setNewStoreId("");
      setAddress("");
    }
  };

  const allLocations = { ...defaultStoreLocations, ...preferences.customStoreLocations };

  const [mapBbox, setMapBbox] = useState("9.8,53.5,10.2,53.7");

  const handleLocationClick = (lat: number, lon: number) => {
    const buffer = 0.01;
    setMapBbox(`${lon - buffer},${lat - buffer},${lon + buffer},${lat + buffer}`);
    setUserLocation(null); // Reset user location marker when clicking a store
  };

  const handleGetUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          const buffer = 0.01;
          setMapBbox(`${longitude - buffer},${latitude - buffer},${longitude + buffer},${latitude + buffer}`);
        },
        (error) => {
          console.error("Error getting location", error);
          alert(t('stores.locationError'));
        }
      );
    } else {
      alert(t('stores.locationError'));
    }
  };

  return (
    <div className="space-y-4 p-4 pt-6">
      <header className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{t('stores.title')}</h1>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('stores.addLocation')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t('stores.selectStore')}</Label>
                <Select value={newStoreId} onValueChange={setNewStoreId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('stores.selectStore')} />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map(store => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('stores.address')}</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Mönckebergstraße 1" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchAddress()}
                  />
                  <Button variant="outline" onClick={handleSearchAddress} disabled={isSearching || !address}>
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex justify-center pt-1">
                  <Button variant="ghost" size="sm" onClick={handleGetUserLocation} className="text-xs gap-2 text-muted-foreground w-full">
                    <Locate className="h-4 w-4" />
                    {t('stores.myLocation')}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('stores.latitude')}</Label>
                  <Input 
                    type="number" 
                    step="any" 
                    placeholder="53.5511"
                    value={newLat}
                    onChange={e => setNewLat(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('stores.longitude')}</Label>
                  <Input 
                    type="number" 
                    step="any" 
                    placeholder="9.9937"
                    value={newLon}
                    onChange={e => setNewLon(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('stores.coordinatesInfo')}
              </p>
              <Button onClick={handleAddLocation} disabled={!newStoreId || !newLat || !newLon} className="w-full">
                {t('stores.add')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <Card className="overflow-hidden border-none shadow-md">
        <CardContent className="p-0">
          <iframe
            title="Hamburg Supermarkets Map"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapBbox}&layer=mapnik${userLocation ? `&marker=${userLocation.lat},${userLocation.lon}` : ''}`}
            className="w-full h-64 border-none"
            loading="lazy"
          />
          <div className="p-3 bg-muted/30 flex flex-wrap gap-2 text-xs">
            {Object.entries(allLocations).map(([id, loc]) => (
              <button
                key={`${id}-${loc.lat}-${loc.lon}`}
                onClick={() => handleLocationClick(loc.lat, loc.lon)}
                className="flex items-center gap-1 hover:bg-primary/10 hover:text-primary bg-background px-2 py-1 rounded-full border shadow-sm transition-colors cursor-pointer"
              >
                <MapPin className="h-3 w-3" />
                {stores.find(s => s.id === id)?.name || id}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stores;