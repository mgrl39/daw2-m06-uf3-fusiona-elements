import { useState, ReactElement } from 'react';
import { Cell, Element, fusionCombinations, generators, ElementType } from '../models/ElementModel';
import Casella from './Casella';
import './Taulell.css';

// Constants
const BOARD_SIZE: number = 6; // Mida de la graella 6x6

// Tipus per a funcions específiques del component
type FusionFunction = (element1: Element, element2: Element) => Element | null;
type DropHandler = (targetCell: Cell) => void;
type DragStartHandler = (cell: Cell) => void;
type GeneratorClickHandler = (fila: number, columna: number) => void;
type FindEmptyCellFunction = () => Cell | null;

const Taulell = (): ReactElement => {
  /**
   * Inicialitza la graella amb cel·les buides i generadors
   * @returns Cell[][] - La graella inicialitzada
   */
  const initializeGrid = (): Cell[][] => {
    const newGrid: Cell[][] = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      const currentRow: Cell[] = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        currentRow.push({ tipus: 'buida', posicio: { fila: row, columna: col } });
      }
      newGrid.push(currentRow);
    }
    
    // Afegir generadors segons la configuració
    generators.forEach(gen => {
      const { fila, columna } = gen.posicio;
      newGrid[fila][columna] = { tipus: 'generador', element: gen.element, posicio: { fila, columna } };
    });
    
    return newGrid;
  };

  const [grid, setGrid] = useState<Cell[][]>(initializeGrid());
  const [draggedCell, setDraggedCell] = useState<Cell | null>(null);

  /**
   * Gestiona el clic en un generador: crea un nou element a la primera cel·la buida
   * @param fila - Fila del generador clicat
   * @param columna - Columna del generador clicat
   */
  const handleGeneratorClick: GeneratorClickHandler = (fila: number, columna: number): void => {
    const generatorCell = grid[fila][columna];
    if (generatorCell.tipus != 'generador' || !generatorCell.element) return;

    // Find the first empty cell
    const emptyCell = findFirstEmptyCell();
    if (!emptyCell) {
      console.log('No hi ha cel·les buides disponibles');
      return;
    }

    // Create a deep copy of the grid to avoid mutation issues
    const newGrid = grid.map(row => [...row]);
    const { fila: emptyRow, columna: emptyCol } = emptyCell.posicio;
    
    // Afegir el nou element a la cel·la buida
    newGrid[emptyRow][emptyCol] = {
      tipus: 'arrossegable',
      element: { 
        tipus: generatorCell.element.tipus as ElementType,
        emoji: generatorCell.element.emoji,
        level: generatorCell.element.level 
      },
      posicio: { fila: emptyRow, columna: emptyCol }
    };

    setGrid(newGrid);
  };

  /**
   * Troba la primera cel·la buida a la graella
   * @returns Cell | null - La primera cel·la buida o null si no hi ha cel·les buides
   */
  const findFirstEmptyCell: FindEmptyCellFunction = (): Cell | null => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (grid[row][col].tipus == 'buida') {
          return grid[row][col];
        }
      }
    }
    return null;
  };

  /**
   * Inicia l'arrossegament d'un element
   * @param cell - La cel·la que s'està arrossegant
   */
  const handleDragStart: DragStartHandler = (cell: Cell): void => {
    if (cell.tipus == 'arrossegable') setDraggedCell(cell);
  };

  /**
   * Gestiona l'esdeveniment de deixar anar un element en una cel·la
   * @param targetCell - La cel·la objectiu on es deixa anar l'element
   */
  const handleDrop: DropHandler = (targetCell: Cell): void => {
    if (!draggedCell) return;
    const cellaArrossegada: { fila: number, columna: number } = draggedCell.posicio;
    const cellaObjectiu: { fila: number, columna: number } = targetCell.posicio;
    // Si s'intenta deixar anar a la mateixa cel·la, no fer res
    if (cellaArrossegada.fila == cellaObjectiu.fila && cellaArrossegada.columna == cellaObjectiu.columna) {
      setDraggedCell(null);
      return;
    }
    
    const sourceRow = cellaArrossegada.fila;
    const sourceCol = cellaArrossegada.columna;
    const targetRow = cellaObjectiu.fila;
    const targetCol = cellaObjectiu.columna;

    // Create a deep copy of the grid to avoid mutation issues
    const newGrid = grid.map(row => [...row]);

    // Gestionar diferents escenaris de deixar anar
    if (targetCell.tipus == 'buida') {
      // Moure a una cel·la buida
      newGrid[targetRow][targetCol] = {
        tipus: 'arrossegable',
        element: draggedCell.element ? { ...draggedCell.element } : undefined,
        posicio: { fila: targetRow, columna: targetCol }
      };

      // Netejar la cel·la original
      newGrid[sourceRow][sourceCol] = { tipus: 'buida', posicio: { fila: sourceRow, columna: sourceCol } };
    } 
    else if (targetCell.tipus == 'arrossegable' && targetCell.element && draggedCell.element) {
      // Intentar fusionar elements
      const result = tryFusion(draggedCell.element, targetCell.element);
      
      if (result) {
        // Fusió exitosa
        newGrid[targetRow][targetCol] = {
          tipus: 'arrossegable',
          element: result,
          posicio: { fila: targetRow, columna: targetCol }
        };

        // Netejar la cel·la d'origen
        newGrid[sourceRow][sourceCol] = { tipus: 'buida', posicio: { fila: sourceRow, columna: sourceCol } };
      }
    }
    setGrid(newGrid);
    setDraggedCell(null);
  };

  /**
   * Intenta fusionar dos elements segons les combinacions definides
   * @param element1 - Primer element a fusionar
   * @param element2 - Segon element a fusionar
   * @returns Element | null - El resultat de la fusió o null si no hi ha combinació vàlida
   */
  const tryFusion: FusionFunction = (element1: Element, element2: Element): Element | null => {
    // Trobar combinació de fusió coincident
    const combination = fusionCombinations.find(
      combo => (combo.primerTipus == element1.tipus && combo.segonTipus == element2.tipus) ||
              (combo.primerTipus == element2.tipus && combo.segonTipus == element1.tipus)
    );

    return combination ? combination.resultat : null;
  };

  return (
    <div className="tauler">
      {grid.map((row: Cell[], rowIndex: number) => (
        <div key={rowIndex} className="fila">
          {row.map((cell: Cell, colIndex: number) => (
            <Casella 
              key={`${rowIndex}-${colIndex}`} 
              cell={cell}
              onGeneratorClick={() => handleGeneratorClick(rowIndex, colIndex)}
              onDragStart={() => handleDragStart(cell)}
              onDrop={() => handleDrop(cell)}
              isDragging={draggedCell !== null}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Taulell;