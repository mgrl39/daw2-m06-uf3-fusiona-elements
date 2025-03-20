// Tipus d'elements, representats per emojis
export type TipusElement = 'foc' | 'aigua' | 'llet' | 'ou' | 'hamburgesa' | 'hamburguesa' | 'camio' | 'aixeta' | 'carn';

// Definim com és un element dins del joc. El tipus, l'emoji que es mostra a la graella i finalment el nivell.
export interface Element {
  tipus: TipusElement;
  emoji: string;
  nivell: number;
}

// Definició de la cel·la.
//Poden existir cel·les sense cap element, altres que poden generar nous elements i finalment les arrossegables que es poden moure i fusionar.
export type TipusCella = 'buida' | 'generador' | 'arrossegable';

// A la interficie tenim el tipus de cel·la, l'element que es guarda i la posició dins la graella. 
export interface Cella {
  tipus: TipusCella;
  element?: Element;
  posicio: { fila: number; columna: number };
}

// Defineix que passa quan dos elements es fusionen. Conté els dos tipus d'elements i el resultat que generen.
export interface ResultatFusio {
  primerTipus: TipusElement;
  segonTipus: TipusElement;
  resultat: Element;
}

// DEFINICIONS GENERALS
// Aquesta funció retorna un objecte amb dos tipus iguals.
function retornaMateixObjecte(tipus : TipusElement) {
  return { primerTipus : tipus, segonTipus : tipus };
}

// Definició de les fusions possibles. Si dos elements coincideixen amb la combinació, es genera un nou element.
export const combinacionsFusions: ResultatFusio[] = [
  { ...retornaMateixObjecte('aigua'), resultat: { tipus: 'llet', emoji: '🥛', nivell: 2 } },
  { ...retornaMateixObjecte('foc'), resultat: { tipus: 'ou', emoji: '🍳', nivell: 2 } },
  { ...retornaMateixObjecte('llet'), resultat: { tipus: 'aixeta', emoji: '🚰', nivell: 3 } },
  { ...retornaMateixObjecte('aixeta'), resultat: { tipus: 'camio', emoji: '🚛', nivell: 4 } },
  { ...retornaMateixObjecte('ou'), resultat: { tipus: 'carn', emoji: '🍗', nivell: 3 } },
  { ...retornaMateixObjecte('carn'), resultat: { tipus: 'hamburguesa', emoji: '🍔', nivell: 4 } }
];

// Definició dels generadors. Es guarda la posició, l'element que genera i l'emoji que mostra.
export interface Generador {
  tipus: 'generador';
  posicio: { fila: number; columna: number };
  element: Element;
  emojiVisual: string;
}

// Definició dels generadors. he definit dos generadors principals. El foc a [0, 0] i l'aigua a [0,5]
// Quan es fa clic en un generador, aquest crea un nou element arrossegable.
export const generadors: Generador[] = [
  {
    tipus: 'generador',
    posicio: { fila: 0, columna: 0 },
    element: { tipus: 'foc' as TipusElement, emoji: '🔥', nivell: 1 },
    emojiVisual: '🌋'
  },
  {
    tipus: 'generador',
    posicio: { fila: 0, columna: 5 },
    element: { tipus: 'aigua' as TipusElement, emoji: '💧', nivell: 1 },
    emojiVisual: '☁'
  }
];