export type ElementType = 'fire' | 'water' | 'milk' | 'egg' | 'meat' | 'burger' | 'truck' | 'tap';

export interface Element {
  type: ElementType;
  emoji: string;
  level: number;
}

export type CellType = 'empty' | 'generator' | 'draggable';

export interface Cell {
  type: CellType;
  element?: Element;
  position: { row: number; col: number };
}

export interface FusionResult {
  type1: ElementType;
  type2: ElementType;
  result: Element;
}

// Define the fusion combinations
export const fusionCombinations: FusionResult[] = [
  { type1: 'water', type2: 'water', result: { type: 'milk', emoji: '🥛', level: 2 } },
  { type1: 'fire', type2: 'fire', result: { type: 'egg', emoji: '🍳', level: 2 } },
  { type1: 'milk', type2: 'milk', result: { type: 'tap', emoji: '🚰', level: 3 } },
  { type1: 'tap', type2: 'tap', result: { type: 'truck', emoji: '🚛', level: 4 } },
  { type1: 'egg', type2: 'egg', result: { type: 'meat', emoji: '🍗', level: 3 } },
  { type1: 'meat', type2: 'meat', result: { type: 'burger', emoji: '🍔', level: 4 } }
];

// Generator definitions
export const generators = [
  {
    type: 'generator',
    position: { row: 0, col: 0 },
    element: { type: 'fire' as ElementType, emoji: '🔥', level: 1 }
  },
  {
    type: 'generator',
    position: { row: 0, col: 5 },
    element: { type: 'water' as ElementType, emoji: '💧', level: 1 }
  }
];