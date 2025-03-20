import { useState, ReactElement } from 'react';
import { Cell, Element, fusionCombinations, generators } from '../models/ElementModel';
import Casella from './Casella';
import './Taulell.css';

// Constants
const BOARD_SIZE: number = 6; // Mida de la graella 6x6

// Tipus per a funcions específiques del component
type FusionFunction = (element1: Element, element2: Element) => Element | null;
type DropHandler = (targetCell: Cell) => void;
type DragStartHandler = (cell: Cell) => void;
type GeneratorClickHandler = (row: number, col: number) => void;
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
        currentRow.push({ type: 'empty', position: { row, col } });
      }
      newGrid.push(currentRow);
    }
    
    // Afegir generadors segons la configuració
    generators.forEach(gen => {
      const { row, col } = gen.position;
      newGrid[row][col] = { type: 'generator', element: gen.element, position: { row, col } };
    });
    
    return newGrid;
  };

  const [grid, setGrid] = useState<Cell[][]>(initializeGrid());
  const [draggedCell, setDraggedCell] = useState<Cell | null>(null);

  /**
   * Gestiona el clic en un generador: crea un nou element a la primera cel·la buida
   * @param row - Fila del generador clicat
   * @param col - Columna del generador clicat
   */
  const handleGeneratorClick: GeneratorClickHandler = (row: number, col: number): void => {
    const generatorCell = grid[row][col];
    if (generatorCell.type !== 'generator' || !generatorCell.element) return;

    // Find the first empty cell
    const emptyCell = findFirstEmptyCell();
    if (!emptyCell) {
      // No hi ha cel·les buides disponibles, mostrar retroalimentació visual o alerta
      console.log('No hi ha cel·les buides disponibles');
      return;
    }

    // Create a deep copy of the grid to avoid mutation issues
    const newGrid = grid.map(row => [...row]);
    const { row: emptyRow, col: emptyCol } = emptyCell.position;
    
    // Afegir el nou element a la cel·la buida
    newGrid[emptyRow][emptyCol] = {
      type: 'draggable',
      element: { 
        type: generatorCell.element.type,
        emoji: generatorCell.element.emoji,
        level: generatorCell.element.level 
      },
      position: { row: emptyRow, col: emptyCol }
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
        if (grid[row][col].type === 'empty') {
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
    if (cell.type === 'draggable') {
      setDraggedCell(cell);
    }
  };

  /**
   * Gestiona l'esdeveniment de deixar anar un element en una cel·la
   * @param targetCell - La cel·la objectiu on es deixa anar l'element
   */
  const handleDrop: DropHandler = (targetCell: Cell): void => {
    if (!draggedCell) return;
    
    // Si s'intenta deixar anar a la mateixa cel·la, no fer res
    if (draggedCell.position.row === targetCell.position.row && 
        draggedCell.position.col === targetCell.position.col) {
      setDraggedCell(null);
      return;
    }
    
    const sourceRow = draggedCell.position.row;
    const sourceCol = draggedCell.position.col;
    const targetRow = targetCell.position.row;
    const targetCol = targetCell.position.col;

    // Create a deep copy of the grid to avoid mutation issues
    const newGrid = grid.map(row => [...row]);

    // Gestionar diferents escenaris de deixar anar
    if (targetCell.type === 'empty') {
      // Moure a una cel·la buida
      newGrid[targetRow][targetCol] = {
        type: 'draggable',
        element: draggedCell.element ? { ...draggedCell.element } : undefined,
        position: { row: targetRow, col: targetCol }
      };

      // Netejar la cel·la original
      newGrid[sourceRow][sourceCol] = {
        type: 'empty',
        position: { row: sourceRow, col: sourceCol }
      };

    } else if (targetCell.type === 'draggable' && targetCell.element && draggedCell.element) {
      // Intentar fusionar elements
      const result = tryFusion(draggedCell.element, targetCell.element);
      
      if (result) {
        // Fusió exitosa
        newGrid[targetRow][targetCol] = {
          type: 'draggable',
          element: result,
          position: { row: targetRow, col: targetCol }
        };

        // Netejar la cel·la d'origen
        newGrid[sourceRow][sourceCol] = {
          type: 'empty',
          position: { row: sourceRow, col: sourceCol }
        };
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
      combo => (combo.type1 === element1.type && combo.type2 === element2.type) ||
              (combo.type1 === element2.type && combo.type2 === element1.type)
    );

    return combination ? combination.result : null;
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