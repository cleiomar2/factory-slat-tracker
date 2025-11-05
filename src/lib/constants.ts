export const CATEGORIES = ['Clothes', 'Trousers', 'Pull Out'] as const;
export const COLORS = ['WH', 'WSO', 'GREY', 'BEIGE'] as const;
export const PRODUCTION_STEPS = ['Po Pile', 'Hotstamping', 'Frezarka', 'Po kółkach', 'Pierwszy cykl'] as const;

export type Category = typeof CATEGORIES[number];
export type Color = typeof COLORS[number];
export type ProductionStep = typeof PRODUCTION_STEPS[number];
export type PositionType = 'Przód' | 'Tył' | 'Domyślne' | 'Boki' | 'Lewy' | 'Lewy HS' | 'Prawy' | 'Prawy HS';

export const LENGTHS: Record<Category, { front_back: number[], side: number[] }> = {
  'Clothes': {
    front_back: [961, 711, 461],
    side: [531, 301]
  },
  'Trousers': {
    front_back: [926, 676, 426],
    side: [531, 301]
  },
  'Pull Out': {
    front_back: [926, 676, 426],
    side: [531, 301]
  }
};

export const getAvailableLengths = (category: Category): number[] => {
  const categoryLengths = LENGTHS[category];
  return [...categoryLengths.front_back, ...categoryLengths.side];
};

export const getPositionTypes = (category: Category, length: number, step: ProductionStep): PositionType[] => {
  const categoryLengths = LENGTHS[category];
  const isSideLength = categoryLengths.side.includes(length);
  
  // Po Pile step: All slats have "Domyślne" position type
  if (step === 'Po Pile') {
    return ['Domyślne'];
  }
  
  // Pierwszy cykl step: Side lengths (531, 301) have Lewy, Lewy HS, Prawy, Prawy HS
  if (step === 'Pierwszy cykl') {
    if (isSideLength) {
      return ['Lewy', 'Lewy HS', 'Prawy', 'Prawy HS'];
    } else {
      return ['Przód', 'Tył'];
    }
  }
  
  // Hotstamping, Frezarka, Po kółkach: Side lengths (531, 301) are "Boki"
  if (step === 'Hotstamping' || step === 'Frezarka' || step === 'Po kółkach') {
    if (isSideLength) {
      return ['Boki'];
    } else {
      return ['Przód', 'Tył'];
    }
  }
  
  // Default fallback
  return ['Przód', 'Tył'];
};

export const COLOR_CLASSES: Record<Color, string> = {
  'WH': 'bg-white border-2 border-gray-300 text-gray-800',
  'WSO': 'bg-yellow-100 border-2 border-yellow-300 text-yellow-800',
  'GREY': 'bg-gray-200 border-2 border-gray-400 text-gray-800',
  'BEIGE': 'bg-amber-100 border-2 border-amber-300 text-amber-800'
};