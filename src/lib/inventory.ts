import { Category, Color, ProductionStep, PositionType } from './constants';

export interface InventoryEntry {
  id: string;
  category: Category;
  color: Color;
  length: number;
  positionType: PositionType;
  productionStep: ProductionStep;
  quantity: number;
  palletId?: string;
  photoUrl?: string;
  timestamp: number;
}

export interface InventoryFilter {
  category?: Category;
  color?: Color;
  productionStep?: ProductionStep;
  dateFrom?: string;
  dateTo?: string;
}

const STORAGE_KEY = 'factory-slat-inventory';

export const saveInventoryEntry = (entry: Omit<InventoryEntry, 'id' | 'timestamp'>): InventoryEntry => {
  const newEntry: InventoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now()
  };
  
  const existingEntries = getInventoryEntries();
  const updatedEntries = [...existingEntries, newEntry];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
  return newEntry;
};

export const getInventoryEntries = (): InventoryEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading inventory entries:', error);
    return [];
  }
};

export const deleteInventoryEntry = (id: string): void => {
  const entries = getInventoryEntries();
  const filtered = entries.filter(entry => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const filterInventoryEntries = (entries: InventoryEntry[], filter: InventoryFilter): InventoryEntry[] => {
  return entries.filter(entry => {
    if (filter.category && entry.category !== filter.category) return false;
    if (filter.color && entry.color !== filter.color) return false;
    if (filter.productionStep && entry.productionStep !== filter.productionStep) return false;
    
    if (filter.dateFrom || filter.dateTo) {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
      if (filter.dateFrom && entryDate < filter.dateFrom) return false;
      if (filter.dateTo && entryDate > filter.dateTo) return false;
    }
    
    return true;
  });
};

export const getInventorySummary = (entries: InventoryEntry[]) => {
  const summary = new Map<string, { count: number; totalQuantity: number; entries: InventoryEntry[] }>();
  
  entries.forEach(entry => {
    const key = `${entry.category}-${entry.color}-${entry.length}-${entry.positionType}-${entry.productionStep}`;
    
    if (!summary.has(key)) {
      summary.set(key, { count: 0, totalQuantity: 0, entries: [] });
    }
    
    const current = summary.get(key)!;
    current.count += 1;
    current.totalQuantity += entry.quantity;
    current.entries.push(entry);
  });
  
  return summary;
};

// Initialize with sample data if empty
export const initializeSampleData = (): void => {
  const existing = getInventoryEntries();
  if (existing.length === 0) {
    const sampleEntries: Omit<InventoryEntry, 'id' | 'timestamp'>[] = [
      {
        category: 'Clothes',
        color: 'WH',
        length: 961,
        positionType: 'Front',
        productionStep: 'Hotstamping',
        quantity: 150,
        palletId: 'P001'
      },
      {
        category: 'Clothes',
        color: 'GREY',
        length: 531,
        positionType: 'Left HS',
        productionStep: 'Last Cycle',
        quantity: 75,
        palletId: 'P002'
      },
      {
        category: 'Trousers',
        color: 'BEIGE',
        length: 926,
        positionType: 'Back',
        productionStep: 'Milling',
        quantity: 200,
        palletId: 'P003'
      },
      {
        category: 'Pull Out',
        color: 'WSO',
        length: 676,
        positionType: 'Default',
        productionStep: 'Saw',
        quantity: 120,
        palletId: 'P004'
      }
    ];
    
    sampleEntries.forEach(entry => saveInventoryEntry(entry));
  }
};