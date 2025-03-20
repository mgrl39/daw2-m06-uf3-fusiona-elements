import React from 'react';
import { Cella } from '../models/ElementModel';
import './Casella.css';

// Definim els ""arguments"" que es passen al component perquè pugui funcionar.
/*
Tenim:
- La informació de la cella, funció que es cridarà quan es faci clic en un generador,
  funció quan comença l'arrosegament, funció quan es deixa anar un element i un "estat"
*/
interface CasellaProps {
  cell: Cella;
  onGeneratorClick: () => void; 
  onDragStart: () => void; 
  onDrop: () => void; 
  isDragging: boolean;
}

// Component com una funció react (retorna JSX)
const Casella: React.FC<CasellaProps> = ({ cell, onGeneratorClick, onDragStart, onDrop, isDragging }) => {
  // S'executa quan es fa clic en un generador. Es crida a la funció passada per props (com si fos argument).
  const gestionarClic  = () => cell.tipus == 'generador' && onGeneratorClick();
  // S'executa quan comença l'arrossegament d'un element. Es crida a la funció passada per props també.
  const gestionarIniciArrossegament = () => cell.tipus == 'arrossegable' && onDragStart();
  // S'executa quan un element arrossegable passa per sobre d'aquesta cel·la. Sense aixo no podriem "deixar anar". Apareix una creu. 
  // Es a dir, evitem que el navegador "bloqueji" l'acció d'arrossegar diguessim.
  const gestionarArrossegamentSobre = (e: React.DragEvent<HTMLDivElement>) => (cell.tipus == 'buida' || cell.tipus == 'arrossegable') && e.preventDefault();
  // S'executa quan un element arrossegable es deixa anar sobre aquesta cel·la
  const gestionarDeixarAnar = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Evitem l'acció per defecte
    onDrop(); // Truquem a la funció passada per props. MOLT IMPORTANT!
  };

  return (
    <div
      // Assignació de classes CSS per donar certs estils segons l'estat de la cel·la.
      className={`casella ${cell.tipus} ${isDragging ? 'arrossegant' : ''}`}
      
      // Es crida a handleClick quan es clica
      onClick={gestionarClic}
      
      // Condicional, si la cel·la és arrossegable, permet l'arrossegar
      draggable={cell.tipus == 'arrossegable'}
      
      // Crida quan s'arrossega la propia cel·la.
      onDragStart={gestionarIniciArrossegament}

      // Crida quan passa altre element per sobre.
      onDragOver={gestionarArrossegamentSobre}
      // Crida quan deixem anar un element.
      onDrop={gestionarDeixarAnar}
    >
      {/* Important: Si la cel·la té un element mostrem el emoji pertintent */}
      {cell.element && (<div className="contingut">{cell.element.emoji}</div>)}</div>
  );
};

export default Casella;