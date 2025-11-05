import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Package, Image as ImageIcon } from 'lucide-react';
import { InventoryEntry, deleteInventoryEntry } from '@/lib/inventory';
import { COLOR_CLASSES } from '@/lib/constants';
import { toast } from 'sonner';

interface InventoryItemProps {
  entry: InventoryEntry;
  onDelete: () => void;
}

export default function InventoryItem({ entry, onDelete }: InventoryItemProps) {
  const handleDelete = () => {
    try {
      deleteInventoryEntry(entry.id);
      toast.success('Wpis inwentarza został usunięty');
      onDelete();
    } catch (error) {
      toast.error('Nie udało się usunąć wpisu');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pl-PL', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="font-semibold">
                {entry.category}
              </Badge>
              <Badge className={COLOR_CLASSES[entry.color]}>
                {entry.color}
              </Badge>
              <Badge variant="outline">
                {entry.length}mm
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Pozycja:</span> {entry.positionType}
              </div>
              <div>
                <span className="font-medium">Etap:</span> {entry.productionStep}
              </div>
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                <span className="font-medium">Ilość:</span> {entry.quantity}
              </div>
              <div>
                <span className="font-medium">Data:</span> {formatDate(entry.timestamp)}
              </div>
            </div>
            
            {entry.palletId && (
              <div className="text-sm">
                <span className="font-medium">ID Palety:</span> {entry.palletId}
              </div>
            )}

            {entry.photoUrl && (
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Zobacz Zdjęcie
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <img
                      src={entry.photoUrl}
                      alt="Zdjęcie palety"
                      className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}