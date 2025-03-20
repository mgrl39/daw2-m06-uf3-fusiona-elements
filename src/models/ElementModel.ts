export type ElementType = 'foc' | 'aigua' | 'llet' | 'ou' | 'hamburgesa' | 'hamburguesa' | 'camio' | 'aixeta' | 'carn';

export interface Element {
  tipus: ElementType;
  emoji: string;
  nivell: number;
}

// Definició de la cel·la
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

// DEFINICIONS GENERALS

function retornaMateixObjecte(tipus : ElementType) {
  return { primerTipus : tipus, segonTipus : tipus };
}

// Definició de les fusiones possibles
export const fusionCombinations: FusionResult[] = [
  { ...retornaMateixObjecte('aigua'), resultat: { tipus: 'llet', emoji: '🥛', nivell: 2 } },
  { ...retornaMateixObjecte('foc'), resultat: { tipus: 'ou', emoji: '🍳', nivell: 2 } },
  { ...retornaMateixObjecte('llet'), resultat: { tipus: 'aixeta', emoji: '🚰', nivell: 3 } },
  { ...retornaMateixObjecte('aixeta'), resultat: { tipus: 'camio', emoji: '🚛', nivell: 4 } },
  { ...retornaMateixObjecte('ou'), resultat: { tipus: 'carn', emoji: '🍗', nivell: 3 } },
  { ...retornaMateixObjecte('carn'), resultat: { tipus: 'hamburguesa', emoji: '🍔', nivell: 4 } }
];

// Definició dels generadors
export const generadors = [
  {
    tipus: 'generador',
    posicio: { fila: 0, columna: 0 },
    element: { tipus: 'foc' as ElementType, emoji: '🔥', nivell: 1 },
    emojiVisual: '🌋'
  },
  {
    tipus: 'generador',
    posicio: { fila: 0, columna: 5 },
    element: { tipus: 'aigua' as ElementType, emoji: '💧', nivell: 1 },
    emojiVisual: '🌊'
  }
];