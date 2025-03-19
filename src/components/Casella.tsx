import React from 'react'
import { CasillaInfo } from '../models/GraellaModel'

interface CasellaProps {
    info: CasillaInfo;
    onClick?: () => void;
    onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
    onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
}

const Casella: React.FC<CasellaProps> = ({
    info,
    onClick,
    onDragStart,
    onDrop
}: CasellaProps): React.ReactElement => {
    const contingut: string = info.elemento ? info.elemento.getEmoji : '';
    const isGenerador: boolean = info.tipo === 'generador';
    const esPotArrastrar: boolean = info.tipo === 'elemento';
    
    return (
        <div
            className={`casella ${isGenerador ? 'generador' : ''} ${info.tipo}`}
            onClick={onClick}
            onDragStart={onDragStart}
            onDrop={onDrop}
            onDragOver={(e: React.DragEvent<HTMLDivElement>): void => e.preventDefault()}
            draggable={esPotArrastrar}
            data-x={info.posicion[0]}
            data-y={info.posicion[1]}
        >
            {contingut}
        </div>
    );
};

export default Casella;
