import React from 'react';
import { Cell } from '../models/ElementModel';
import './Casella.css';

interface CasellaProps {
  cell: Cell;
  onGeneratorClick: () => void; 
  onDragStart: () => void; 
  onDrop: () => void; 
  isDragging: boolean;
}

const Casella: React.FC<CasellaProps> = ({ cell, onGeneratorClick, onDragStart, onDrop, isDragging }) => {
  // S'executa quan es fa clic en un generador
  const handleClick = () => cell.tipus == 'generador' && onGeneratorClick();
  // S'executa quan comença l'arrossegament d'un element
  const handleDragStart = () => cell.tipus == 'arrossegable' && onDragStart();
  // S'executa quan un element arrossegable passa per sobre d'aquesta cel·la
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => (cell.tipus == 'buida' || cell.tipus == 'arrossegable') && e.preventDefault();
  // S'executa quan un element arrossegable es deixa anar sobre aquesta cel·la
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop();
  };

  return (
    <div
      className={`casella ${cell.tipus} ${isDragging ? 'arrossegant' : ''}`}
      onClick={handleClick}
      draggable={cell.tipus == 'arrossegable'}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {cell.element && (<div className="contingut">{cell.element.emoji}</div>)}</div>
  );
};

export default Casella;