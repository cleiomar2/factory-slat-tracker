import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { saveInventoryEntry } from '@/lib/inventory';
import { CATEGORIES, COLORS, PRODUCTION_STEPS, getAvailableLengths, getPositionTypes, COLOR_CLASSES } from '@/lib/constants';
import type { Category, Color, ProductionStep, PositionType } from '@/lib/constants';

interface InventoryEntryProps {
  onEntryAdded: () => void;
}

export default function InventoryEntry({ onEntryAdded }: InventoryEntryProps) {
  const [category, setCategory] = useState<Category | ''>('');
  const [color, setColor] = useState<Color | ''>('');
  const [length, setLength] = useState<number | ''>('');
  const [positionType, setPositionType] = useState<PositionType | ''>('');
  const [productionStep, setProductionStep] = useState<ProductionStep | ''>('');
  const [quantity, setQuantity] = useState<string>('');
  const [palletId, setPalletId] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  
  const [availableLengths, setAvailableLengths] = useState<number[]>([]);
  const [availablePositions, setAvailablePositions] = useState<PositionType[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update available lengths when category changes
  useEffect(() => {
    if (category) {
      const lengths = getAvailableLengths(category);
      setAvailableLengths(lengths);
      setLength('');
      setPositionType('');
    }
  }, [category]);

  // Update available positions when category, length, or production step changes
  useEffect(() => {
    if (category && length && productionStep) {
      const positions = getPositionTypes(category, length, productionStep);
      setAvailablePositions(positions);
      setPositionType('');
    }
  }, [category, length, productionStep]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Rozmiar zdjęcia musi być mniejszy niż 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotoUrl(result);
        toast.success('Zdjęcie zostało przesłane pomyślnie');
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !color || !length || !positionType || !productionStep || !quantity) {
      toast.error('Proszę wypełnić wszystkie wymagane pola');
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Proszę wprowadzić prawidłową ilość');
      return;
    }

    try {
      saveInventoryEntry({
        category,
        color,
        length,
        positionType,
        productionStep,
        quantity: quantityNum,
        palletId: palletId || undefined,
        photoUrl: photoUrl || undefined
      });

      toast.success('Wpis inwentarza został dodany pomyślnie');
      
      // Reset form
      setCategory('');
      setColor('');
      setLength('');
      setPositionType('');
      setProductionStep('');
      setQuantity('');
      setPalletId('');
      setPhotoUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      onEntryAdded();
    } catch (error) {
      toast.error('Nie udało się zapisać wpisu inwentarza');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Dodaj Wpis do Inwentarza</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategoria *</Label>
              <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Wybierz kategorię" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat} className="text-lg py-3">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Kolor *</Label>
              <Select value={color} onValueChange={(value: Color) => setColor(value)}>
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Wybierz kolor" />
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map(col => (
                    <SelectItem key={col} value={col} className="text-lg py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${COLOR_CLASSES[col]}`}></div>
                        {col}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="length">Długość (mm) *</Label>
              <Select 
                value={length.toString()} 
                onValueChange={(value) => setLength(parseInt(value))}
                disabled={!category}
              >
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Wybierz długość" />
                </SelectTrigger>
                <SelectContent>
                  {availableLengths.map(len => (
                    <SelectItem key={len} value={len.toString()} className="text-lg py-3">
                      {len}mm
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productionStep">Etap Produkcji *</Label>
              <Select value={productionStep} onValueChange={(value: ProductionStep) => setProductionStep(value)}>
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Wybierz etap" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTION_STEPS.map(step => (
                    <SelectItem key={step} value={step} className="text-lg py-3">
                      {step}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="positionType">Typ Pozycji *</Label>
              <Select 
                value={positionType} 
                onValueChange={(value: PositionType) => setPositionType(value)}
                disabled={!category || !length || !productionStep}
              >
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Wybierz pozycję" />
                </SelectTrigger>
                <SelectContent>
                  {availablePositions.map(pos => (
                    <SelectItem key={pos} value={pos} className="text-lg py-3">
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Ilość *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Wprowadź ilość"
                className="h-12 text-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="palletId">ID Palety (Opcjonalne)</Label>
            <Input
              id="palletId"
              type="text"
              value={palletId}
              onChange={(e) => setPalletId(e.target.value)}
              placeholder="Wprowadź ID palety lub lokalizację"
              className="h-12 text-lg"
            />
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-2">
            <Label>Zdjęcie Palety (Opcjonalne)</Label>
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              
              {!photoUrl ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-12 text-lg"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Dodaj Zdjęcie
                </Button>
              ) : (
                <div className="relative">
                  <img
                    src={photoUrl}
                    alt="Zdjęcie palety"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removePhoto}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full h-14 text-lg font-semibold">
            Dodaj do Inwentarza
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}