# Factory Slat Tracker - MVP Implementation Plan

## Core Files to Create:
1. **src/pages/Index.tsx** - Main app with tab navigation
2. **src/components/InventoryEntry.tsx** - Form for adding new inventory entries
3. **src/components/InventorySummary.tsx** - Display and filter existing inventory
4. **src/components/InventoryItem.tsx** - Individual inventory item component
5. **src/lib/inventory.ts** - Data models, business logic, and localStorage utilities
6. **src/lib/constants.ts** - Product configuration (categories, colors, lengths, etc.)

## Key Features:
- Mobile-responsive design with large touch-friendly buttons
- Dropdown selections for Category, Color, Length, Production Step, Position Type
- Smart position type filtering based on production step and length rules
- Quantity input and optional pallet ID
- Local storage for offline functionality
- Summary view with filtering capabilities
- Factory-friendly UI with clear visual indicators

## Data Model:
- Category: Clothes, Trousers, Pull Out
- Color: WH, WSO, GREY, BEIGE  
- Length: varies by category and position
- Position Type: Front, Back, Side (Left/Right for Last Cycle only)
- Production Step: Saw, Hotstamping, Milling, Circles, Last Cycle
- Business rules: No sides in Milling/Circles, Left/Right only in Last Cycle

## Implementation Strategy:
- Use React hooks for state management
- localStorage for data persistence
- shadcn-ui components for consistent UI
- Mobile-first responsive design
- Form validation and error handling