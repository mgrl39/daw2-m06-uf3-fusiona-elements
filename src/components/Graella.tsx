import React, { useState, useEffect } from 'react';
import Casella from './Casella';
import GraellaModel, { CasillaInfo, Posicion } from '../models/GraellaModel';
import ElementModel from '../models/ElementModel';

function Graella(): React.ReactElement {
    const [modelo, setModelo] = useState<GraellaModel>(new GraellaModel(6));
    const [grid, setGrid] = useState<CasillaInfo[][]>(modelo.getGrid);
    const [elementoArrastrado, setElementoArrastrado] = useState<Posicion | null>(null);
    
    // Actualizar la vista cuando cambie el modelo
    useEffect((): void => {
        setGrid([...modelo.getGrid]);
    }, [modelo]);
    
    const handleGenerarElemento = (x: number, y: number): void => {
        const elementoGenerado: ElementModel | null = modelo.generarElemento(x, y);
        if (elementoGenerado) {
            // Buscar todas las casillas vacías en el tablero
            const casillaVacias: Posicion[] = [];
            
            for (let fila: number = 0; fila < grid.length; fila++) {
                for (let col: number = 0; col < grid[0].length; col++) {
                    if (grid[fila][col].tipo === 'vacia') {
                        casillaVacias.push([col, fila] as Posicion);
                    }
                }
            }
            
            // Verificar si hay casillas vacías disponibles
            if (casillaVacias.length > 0) {
                // Seleccionar una casilla vacía aleatoria
                const indiceAleatorio: number = Math.floor(Math.random() * casillaVacias.length);
                const [nuevoX, nuevoY]: Posicion = casillaVacias[indiceAleatorio];
                
                const nuevaGrid: CasillaInfo[][] = [...grid];
                nuevaGrid[nuevoY][nuevoX] = {
                    tipo: 'elemento',
                    elemento: elementoGenerado,
                    posicion: [nuevoX, nuevoY] as Posicion
                };
                
                const nuevoModelo: GraellaModel = new GraellaModel(6);
                nuevoModelo.getGrid.forEach((fila: CasillaInfo[], y: number): void => {
                    fila.forEach((_, x: number): void => {
                        nuevoModelo.getGrid[y][x] = nuevaGrid[y][x];
                    });
                });
                
                setModelo(nuevoModelo);
            }
        }
    };
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, x: number, y: number): void => {
        setElementoArrastrado([x, y] as Posicion);
        e.dataTransfer.setData('text/plain', `${x},${y}`);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, destinoX: number, destinoY: number): void => {
        e.preventDefault();
        if (elementoArrastrado) {
            const [origenX, origenY]: Posicion = elementoArrastrado;
            
            const nuevoModelo: GraellaModel = new GraellaModel(6);
            nuevoModelo.getGrid.forEach((fila: CasillaInfo[], y: number): void => {
                fila.forEach((_, x: number): void => {
                    nuevoModelo.getGrid[y][x] = grid[y][x];
                });
            });
            
            const movimientoExitoso: boolean = nuevoModelo.moverElemento(origenX, origenY, destinoX, destinoY);
            
            if (movimientoExitoso) {
                setModelo(nuevoModelo);
            }
            
            setElementoArrastrado(null);
        }
    };
    
    return (
        <div className="graella">
            {grid.map((fila: CasillaInfo[], y: number): React.ReactElement => (
                <div key={y} className="fila">
                    {fila.map((casilla: CasillaInfo, x: number): React.ReactElement => (
                        <Casella 
                            key={`${x}-${y}`}
                            info={casilla}
                            onClick={(): void => {
                                casilla.tipo === 'generador' && handleGenerarElemento(x, y);
                            }}
                            onDragStart={(e: React.DragEvent<HTMLDivElement>): void => {
                                casilla.tipo === 'elemento' && handleDragStart(e, x, y);
                            }}
                            onDrop={(e: React.DragEvent<HTMLDivElement>): void => handleDrop(e, x, y)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Graella;