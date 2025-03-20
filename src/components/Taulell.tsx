// Per gestionar l'estat del component. (useState)
// ReactElement per indicar que el component retorna un element de React.
import { useState, ReactElement } from 'react';
import { Cella, Element, combinacionsFusions, generadors, TipusElement, ResultatFusio } from '../models/ElementModel';
import Casella from './Casella';
import './Taulell.css';

// Constants
// Mida de la graella 6x6
const MIDA_TAULER: number = 6;

// Definim tipus personalitzats per definir com han de ser les funcions que es passen com a paràmetres
type GestorDeixarAnar = (cellaObjectiu: Cella) => void;
type GestorIniciArrossegament = (cella: Cella) => void;
type GestorClicGenerador = (fila: number, columna: number) => void;

const Taulell = (): ReactElement => {
  /**
   * Inicialitza la graella amb cel·les buides, afegeix els generadors on calgui.
   * Retorna Cell[][] - La graella inicialitzada
   */
  const inicialitzarGraella = (): Cella[][] => {
    const novaGraella: Cella[][] = [];
    for (let fila : number = 0; fila < MIDA_TAULER; fila++) {
      const filaActual: Cella[] = [];
      // Afegim una cel·la buida a cada posició
      for (let columna = 0; columna < MIDA_TAULER; columna++) {
        filaActual.push({ tipus: 'buida', posicio: { fila, columna } });
      }
      novaGraella.push(filaActual);
    }
    
    // Afegir generadors segons la configuració. Sense aquesta part no tindrem generadors
    generadors.forEach(gen => {
      const { fila, columna } = gen.posicio;
      novaGraella[fila][columna] = { tipus: 'generador', element: {
        ...gen.element,
        tipus: gen.element.tipus as TipusElement,
        emoji: gen.emojiVisual,
      }, posicio: { fila, columna } };
    });
    return novaGraella;
  };

  // Estat de la graella.
  /*
    - graella -> Estat que conté l'estructura de la graella 
    - setGraella -> Funció per actualitzar l'estat de la graella
    - caellaArrossegada -> Estat que guarda la cel·la que s'esta arrossegant
    - setCellaArrossegada -> Funció per actualizar l'estat de la cel·la arrossegada
  */
  const [graella, setGraella] = useState<Cella[][]>(inicialitzarGraella());
  // Estat per saber quina cel·la s'està arrossegant.
  const [cellaArrossegada, setCellaArrossegada] = useState<Cella | null>(null);

  /**
   * Gestiona el clic en un generador: crea un nou element.
   * fila - Fila del generador clicat
   * columna - Columna del generador clicat
   */
  const gestorClicGenerador: GestorClicGenerador = (fila: number, columna: number): void => {
    const cellaGenerador : Cella = graella[fila][columna];
    if (cellaGenerador.tipus != 'generador' || !cellaGenerador.element) return;

    // Troba la primera cel·la buida per comprovar si hi ha cel·les buides (disponibles)
    // Recordem que graella es [][], per tant utilitzant flat() obtenim un array lineal.
    const cellaBuida : Cella | undefined = graella.flat().find(cella => cella.tipus == 'buida');
    // Si no hi troba, no podem crear element per tant sortim.
    if (!cellaBuida) return console.log('No hi ha cel·les buides disponibles');

    /* Utilitzem una còpia de la graella per evitar "problemes de mutació". Es a dir, 
     * fem una còpia de la graella original i la modifiquem per no afetar la graella original.
     * !! React treballa amb estat immutable
     */
    const novaGraella : Cella[][] = graella.map(fila => [...fila]);
    const { fila: filaBuida, columna: columnaBuida } = cellaBuida.posicio;
    
    // Trobar el generador original amb l'emoji correcte per crear l'element
    // Busquem el generador en la definició original per obtenir l'emoji correcte
    const generadorOriginal = generadors.find(gen => gen.posicio.fila == fila && gen.posicio.columna == columna);
    
    // Afegir el nou element a la cel·la buida
    // Es busca el generador original. 
    // Es crea un nou element arrossegable a la primera cel·la buida. Es copia el tipus, emoji i nivell.
    novaGraella[filaBuida][columnaBuida] = {
      tipus: 'arrossegable',
      element: { 
        tipus: cellaGenerador.element.tipus as TipusElement,
        emoji: generadorOriginal ? generadorOriginal.element.emoji : cellaGenerador.element.emoji,
        nivell: cellaGenerador.element.nivell 
      },
      posicio: { fila: filaBuida, columna: columnaBuida }
    };

    // Actualitzar la graella
    setGraella(novaGraella);
  };

  /**
   * Inicia l'arrossegament d'un element
   * cella - La cel·la que s'està arrossegant
   * Guarda la cel·la que s'està arrossegant
   */
  const gestorIniciArrossegament: GestorIniciArrossegament = (cella) => cella.tipus == 'arrossegable' && setCellaArrossegada(cella);

  /**
   * Gestiona l'esdeveniment de deixar anar un element en una cel·la
   * cellaObjectiu - La cel·la objectiu on es deixa anar l'element
   * Si es deixa un element sobre una altre cel·la hem de fer una comprovació de si es pot moure o fusionar.
   */
  const gestorDeixarAnar: GestorDeixarAnar = (cellaObjectiu: Cella): void => {
    if (!cellaArrossegada) return;
    const posicioOrigen: { fila: number, columna: number } = cellaArrossegada.posicio;
    const posicioDestinacio: { fila: number, columna: number } = cellaObjectiu.posicio;
    // Si s'intenta deixar anar a la mateixa cel·la, no fer res. Es a dir, a si mateixa
    if (posicioOrigen.fila == posicioDestinacio.fila && posicioOrigen.columna == posicioDestinacio.columna) {
      setCellaArrossegada(null);
      return;
    }
    
    const filaOrigen : number = posicioOrigen.fila;
    const columnaOrigen : number = posicioOrigen.columna;
    const filaObjectiu : number = posicioDestinacio.fila;
    const columnaObjectiu : number = posicioDestinacio.columna;

    // Utilitzem una còpia de la graella per evitar "problemes de mutació"
    const novaGraella : Cella[][] = graella.map(fila => [...fila]);

    // Gestionar diferents escenaris de deixar anar
    // Moure a una cel·la si es buida.
    if (cellaObjectiu.tipus == 'buida') {
      novaGraella[filaObjectiu][columnaObjectiu] = {
        tipus: 'arrossegable',
        element: cellaArrossegada.element ? { ...cellaArrossegada.element } : undefined,
        posicio: { fila: filaObjectiu, columna: columnaObjectiu }
      };

      // Netejar la cel·la original: IMPORTANT!!!
      novaGraella[filaOrigen][columnaOrigen] = { tipus: 'buida', posicio: { fila: filaOrigen, columna: columnaOrigen } };
    }  // Si els dos elements son arrossegables, intentar fusionar. Si la fusió no es possible no passa res.
    else if (cellaObjectiu.tipus == 'arrossegable' && cellaObjectiu.element && cellaArrossegada.element) {
      // Intentar fusionar elements
      const resultat : Element | null = provarFusio(cellaArrossegada.element, cellaObjectiu.element);
      if (resultat) {
        // Fusió exitosa
        novaGraella[filaObjectiu][columnaObjectiu] = {
          tipus: 'arrossegable',
          element: resultat,
          posicio: { fila: filaObjectiu, columna: columnaObjectiu }
        };
        // Netejar la cel·la d'origen
        novaGraella[filaOrigen][columnaOrigen] = { tipus: 'buida', posicio: { fila: filaOrigen, columna: columnaOrigen } };
      }
    }
    setGraella(novaGraella);
    // setCellaArrossegada passant null ens serveix per "resetejar" el estat una vegada la acció d'arrossegar ha acabat.
    // Es pot comprovar que si ho treiem queda verd el planol.
    setCellaArrossegada(null);
  };

  /**
   * Intenta fusionar dos elements segons les combinacions definides
   * primerElement - Primer element a fusionar
   * segonElement - Segon element a fusionar
   * Retorna Element | null - El resultat de la fusió o null si no hi ha combinació vàlida
   */
  const provarFusio = (primerElement: Element, segonElement: Element): Element | null => {
    const [tipus1, tipus2] = [primerElement.tipus, segonElement.tipus].sort()
    for (let i = 0; i < combinacionsFusions.length; i++) {
      const combinacio : ResultatFusio = combinacionsFusions[i];
      const [primerTipus, segonTipus] = [combinacio.primerTipus, combinacio.segonTipus].sort();
      if (tipus1 == primerTipus && tipus2 == segonTipus) return combinacio.resultat;
    }
    return null;
  };

  // Renderització
  return (
    <div className="tauler">
      {graella.map((fila: Cella[], indexFila: number) => (
        <div key={indexFila} className="fila">
          {fila.map((cella: Cella, indexColumna: number) => (
            <Casella 
              key={`${indexFila}-${indexColumna}`} 
              cell={cella}
              onGeneratorClick={() => gestorClicGenerador(indexFila, indexColumna)}
              onDragStart={() => gestorIniciArrossegament(cella)}
              onDrop={() => gestorDeixarAnar(cella)}
              isDragging={cellaArrossegada != null}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Taulell;