import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, BarChart3 } from 'lucide-react';
import InventoryEntry from '@/components/InventoryEntry';
import InventorySummary from '@/components/InventorySummary';
import { initializeSampleData } from '@/lib/inventory';

export default function Index() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    initializeSampleData();
  }, []);

  const handleEntryAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tracker Listew Fabrycznych
          </h1>
          <p className="text-lg text-gray-600">
            System zarządzania inwentarzem dla fabryki
          </p>
        </div>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="add" className="text-lg py-3">
              <Package className="h-5 w-5 mr-2" />
              Dodaj Wpis
            </TabsTrigger>
            <TabsTrigger value="summary" className="text-lg py-3">
              <BarChart3 className="h-5 w-5 mr-2" />
              Podsumowanie
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-6">
            <InventoryEntry onEntryAdded={handleEntryAdded} />
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <InventorySummary refreshTrigger={refreshTrigger} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}