import React from 'react'

type CasellaProps = {
    contingut: string;
    isGenerador?: boolean;
    esPotArrastrar?: boolean;
    onClick?: () => void;
    onDragStart?: (event: React.DragEvent) => void;
    onDrop?: (event: React.DragEvent) => void;
}

const Casella = ({
    contingut,
    isGenerador,
    esPotArrastrar,
    onClick,
    onDragStart,
    onDrop
}: CasellaProps) => (
    <div
        className={`casella ${isGenerador ? 'generador' : ''}`}
        onClick={onClick}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        draggable={esPotArrastrar}
    >
        {contingut}
    </div>
);

export default Casella;
