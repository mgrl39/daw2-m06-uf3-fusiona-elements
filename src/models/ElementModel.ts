export type ElementType = 'foc' | 'aigua' | 'llet' | 'ou' | 'hamburgesa' | 'hamburguesa' | 'camio' | 'aixeta' | 'carn';

export interface Element {
  tipus: ElementType;
  emoji: string;
  level: number;
}

export type CellType = 'buida' | 'generador' | 'arrossegable';

export interface Cell {
  tipus: CellType;
  element?: Element;
  posicio: { fila: number; columna: number };
}

export interface FusionResult {
  primerTipus: ElementType;
  segonTipus: ElementType;
  resultat: Element;
}

// Define the fusion combinations
export const fusionCombinations: FusionResult[] = [
  { primerTipus: 'aigua', segonTipus: 'aigua', resultat: { tipus: 'llet', emoji: '🥛', level: 2 } },
  { primerTipus: 'foc', segonTipus: 'foc', resultat: { tipus: 'ou', emoji: '🍳', level: 2 } },
  { primerTipus: 'llet', segonTipus: 'llet', resultat: { tipus: 'aixeta', emoji: '🚰', level: 3 } },
  { primerTipus: 'aixeta', segonTipus: 'aixeta', resultat: { tipus: 'camio', emoji: '🚛', level: 4 } },
  { primerTipus: 'ou', segonTipus: 'ou', resultat: { tipus: 'carn', emoji: '🍗', level: 3 } },
  { primerTipus: 'carn', segonTipus: 'carn', resultat: { tipus: 'hamburguesa', emoji: '🍔', level: 4 } }
];

// Generator definitions
export const generators = [
  {
    tipus: 'generador',
    posicio: { fila: 0, columna: 0 },
    element: { tipus: 'foc', emoji: '🔥', level: 1 }
  },
  {
    tipus: 'generador',
    posicio: { fila: 0, columna: 5 },
    element: { tipus: 'aigua', emoji: '💧', level: 1 }
  }
];