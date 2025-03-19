export type TipoElemento = 'agua' | 'fuego' | 'leche' | 'huevo' | 'agua_purificada' | 'camion' | 'pollo' | 'hamburguesa';

export default class ElementModel {
    private tipo: TipoElemento;
    private emoji: string;
    private nivel: number;
    
    constructor(tipo: TipoElemento, emoji: string, nivel: number = 1) {
        this.tipo = tipo;
        this.emoji = emoji;
        this.nivel = nivel;
    }
    
    public get getTipo(): TipoElemento {
        return this.tipo;
    }
    
    public get getEmoji(): string {
        return this.emoji;
    }
    
    public get getNivel(): number {
        return this.nivel;
    }
} 