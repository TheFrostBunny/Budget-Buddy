import React, { useState, useEffect } from 'react';
import { products as defaultProducts } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PRICE_STORAGE_KEY = 'customProductPrices';
const PRODUCT_STORAGE_KEY = 'customProducts';

export function ProductPriceEditor() {
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});
  const [products, setProducts] = useState<Array<any>>([...defaultProducts]);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const defaultCategory = 'annet';
  const defaultDietaryInfo: any[] = [];
  const unitOptions = ['kg', 'stk', 'pk', 'L', 'g', 'ml', 'boks', 'pose', 'annet'];

  useEffect(() => {
    const storedPrices = localStorage.getItem(PRICE_STORAGE_KEY);
    if (storedPrices) {
      setCustomPrices(JSON.parse(storedPrices));
    }
    const storedProducts = localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PRICE_STORAGE_KEY, JSON.stringify(customPrices));
  }, [customPrices]);

  useEffect(() => {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  function handlePriceChange(productId: string, value: string) {
    const price = parseFloat(value);
    if (!isNaN(price) && price >= 0) {
      setCustomPrices({ ...customPrices, [productId]: price });
    }
  }

  function addProduct() {
    if (name.trim() && unit.trim()) {
      setProducts([
        ...products,
        {
          id: Date.now().toString(),
          name: name.trim(),
          unit: unit.trim(),
          category: defaultCategory,
          dietaryInfo: defaultDietaryInfo,
        },
      ]);
      setName('');
      setUnit('');
    }
  }

  function removeProduct(id: string) {
    setProducts(products.filter((p) => p.id !== id));
    // Remove price for deleted product
    const newPrices = { ...customPrices };
    delete newPrices[id];
    setCustomPrices(newPrices);
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Endre priser og varer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="mb-2 flex items-center gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Navn på vare"
            className="w-40"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-24 rounded border px-2 py-1 text-sm"
          >
            <option value="">Velg enhet</option>
            {unitOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <Button onClick={addProduct}>Legg til</Button>
        </div>
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-2">
            <span className="w-40 truncate">{product.name}</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={customPrices[product.id]?.toString() ?? ''}
              onChange={(e) => handlePriceChange(product.id, e.target.value)}
              placeholder="Pris (€)"
              className="w-24"
            />
            <span className="text-xs text-muted-foreground">/ {product.unit}</span>
            <span className="ml-2 text-xs text-muted-foreground">💬</span>
            <Button variant="ghost" size="sm" onClick={() => removeProduct(product.id)}>
              Fjern
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
