import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RotateCcw, TrendingUp, Package, Calendar, Eye } from 'lucide-react';
import { getInventoryEntries, filterInventoryEntries, getInventorySummary } from '@/lib/inventory';
import { CATEGORIES, COLORS, PRODUCTION_STEPS, COLOR_CLASSES } from '@/lib/constants';
import type { InventoryEntry, InventoryFilter } from '@/lib/inventory';
import type { Category, Color, ProductionStep } from '@/lib/constants';
import InventoryItem from './InventoryItem';

interface InventorySummaryProps {
  refreshTrigger: number;
}

export default function InventorySummary({ refreshTrigger }: InventorySummaryProps) {
  const [entries, setEntries] = useState<InventoryEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<InventoryEntry[]>([]);
  const [filter, setFilter] = useState<InventoryFilter>({});
  const [showDetails, setShowDetails] = useState(false);
  const [selectedGroupEntries, setSelectedGroupEntries] = useState<InventoryEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadEntries = () => {
    const allEntries = getInventoryEntries();
    setEntries(allEntries);
    const filtered = filterInventoryEntries(allEntries, filter);
    setFilteredEntries(filtered);
  };

  useEffect(() => {
    loadEntries();
  }, [refreshTrigger]);

  useEffect(() => {
    const filtered = filterInventoryEntries(entries, filter);
    setFilteredEntries(filtered);
  }, [entries, filter]);

  const clearFilters = () => {
    setFilter({});
  };

  const handleGroupClick = (groupEntries: InventoryEntry[]) => {
    setSelectedGroupEntries(groupEntries);
    setDialogOpen(true);
  };

  const summary = getInventorySummary(filteredEntries);
  const totalEntries = filteredEntries.length;
  const totalQuantity = filteredEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const uniqueProducts = summary.size;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{totalEntries}</span>
            </div>
            <p className="text-sm text-muted-foreground">Łączna Liczba Wpisów</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{totalQuantity}</span>
            </div>
            <p className="text-sm text-muted-foreground">Łączna Ilość</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{uniqueProducts}</span>
            </div>
            <p className="text-sm text-muted-foreground">Unikalne Produkty</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Filtry</span>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Wyczyść
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Kategoria</Label>
              <Select 
                value={filter.category || 'all'} 
                onValueChange={(value: string) => 
                  setFilter(prev => ({ ...prev, category: value === 'all' ? undefined : value as Category }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wszystkie kategorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie kategorie</SelectItem>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Kolor</Label>
              <Select 
                value={filter.color || 'all'} 
                onValueChange={(value: string) => 
                  setFilter(prev => ({ ...prev, color: value === 'all' ? undefined : value as Color }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wszystkie kolory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie kolory</SelectItem>
                  {COLORS.map(color => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${COLOR_CLASSES[color]}`}></div>
                        {color}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Etap Produkcji</Label>
              <Select 
                value={filter.productionStep || 'all'} 
                onValueChange={(value: string) => 
                  setFilter(prev => ({ ...prev, productionStep: value === 'all' ? undefined : value as ProductionStep }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wszystkie etapy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie etapy</SelectItem>
                  {PRODUCTION_STEPS.map(step => (
                    <SelectItem key={step} value={step}>{step}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data Od</Label>
              <Input
                type="date"
                value={filter.dateFrom || ''}
                onChange={(e) => setFilter(prev => ({ ...prev, dateFrom: e.target.value || undefined }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Wyniki Inwentarza ({filteredEntries.length})</CardTitle>
            <Button 
              variant="outline" 
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Pokaż Podsumowanie' : 'Pokaż Szczegóły'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nie znaleziono wpisów inwentarza pasujących do bieżących filtrów.
            </div>
          ) : showDetails ? (
            <div className="space-y-3">
              {filteredEntries.map(entry => (
                <InventoryItem 
                  key={entry.id} 
                  entry={entry} 
                  onDelete={loadEntries}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from(summary.entries()).map(([key, data]) => {
                const [category, color, length, positionType, productionStep] = key.split('-');
                return (
                  <div 
                    key={key} 
                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleGroupClick(data.entries)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary">{category}</Badge>
                        <Badge className={COLOR_CLASSES[color as Color]}>{color}</Badge>
                        <Badge variant="outline">{length}mm</Badge>
                        <Badge variant="outline">{positionType}</Badge>
                        <Badge variant="outline">{productionStep}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-semibold text-lg">{data.totalQuantity}</div>
                          <div className="text-sm text-muted-foreground">{data.count} wpisów</div>
                        </div>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Szczegółowe Wpisy ({selectedGroupEntries.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {selectedGroupEntries.map(entry => (
              <InventoryItem 
                key={entry.id} 
                entry={entry} 
                onDelete={() => {
                  loadEntries();
                  // Update the selected group entries after deletion
                  setSelectedGroupEntries(prev => prev.filter(e => e.id !== entry.id));
                }}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}