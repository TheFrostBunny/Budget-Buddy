import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LOCAL_STORAGE_KEY = 'customProducts';

export interface CustomProduct {
  id: string;
  name: string;
  unit: string;
}

export function ProductManager() {
  const [products, setProducts] = useState<CustomProduct[]>([]);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setProducts(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  function addProduct() {
    if (name.trim() && unit.trim()) {
      setProducts([
        ...products,
        { id: Date.now().toString(), name: name.trim(), unit: unit.trim() },
      ]);
      setName('');
      setUnit('');
    }
  }

  function removeProduct(id: string) {
    setProducts(products.filter((p) => p.id !== id));
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Legg til og fjern varer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Navn på vare"
            className="w-40"
          />
          <Input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Enhet (kg, stk, pk...)"
            className="w-24"
          />
          <Button onClick={addProduct}>Legg til</Button>
        </div>
        <ul className="space-y-2">
          {products.map((product) => (
            <li key={product.id} className="flex items-center gap-2">
              <span className="w-40 truncate">{product.name}</span>
              <span className="text-xs text-muted-foreground">{product.unit}</span>
              <Button variant="ghost" size="sm" onClick={() => removeProduct(product.id)}>
                Fjern
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
