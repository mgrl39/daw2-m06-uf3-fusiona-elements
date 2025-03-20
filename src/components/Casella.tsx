import React from 'react';
import { Cell } from '../models/ElementModel';
import './Casella.css';

interface CasellaProps { cell: Cell; 
  onGeneratorClick: () => void; onDragStart: () => void; onDrop: () => void; isDragging: boolean; 
}

const Casella: React.FC<CasellaProps> = ({ cell, onGeneratorClick, onDragStart, onDrop, isDragging }) => {
  // Handle generator clicks
  const handleClick = () => {
    if (cell.type === 'generator') {
      onGeneratorClick();
    }
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (cell.type === 'draggable') {
      //e.dataTransfer.setData('text/plain', ''); // Required for Firefox
      onDragStart();
    }
  };

  // Handle drag over to allow drops
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (cell.type === 'empty' || cell.type === 'draggable') {
      e.preventDefault(); // Allow drop
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop();
  };

  return (
    <div 
      className={`casilla ${cell.type} ${isDragging ? 'is-dragging' : ''}`}
      onClick={handleClick}
      draggable={cell.type === 'draggable'}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {cell.element && (
        <div className="contenido">
          {cell.element.emoji}
        </div>
      )}
    </div>
  );
};

export default Casella;