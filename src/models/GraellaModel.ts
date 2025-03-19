import ElementModel, { TipoElemento } from './ElementModel';

export type TipoCasilla = 'vacia' | 'generador' | 'elemento';
export type Posicion = [number, number]; // Tipo explícito para posición

export interface CasillaInfo {
    tipo: TipoCasilla;
    elemento?: ElementModel;
    posicion: Posicion;
}

export default class GraellaModel {
    private grid: CasillaInfo[][];
    private reglasFusion: Map<string, ElementModel>;
    
    constructor(tamano: number = 6) {
        // Inicializar la cuadrícula vacía con posiciones como arrays
        this.grid = Array(tamano).fill(null).map((_, y: number): CasillaInfo[] => 
            Array(tamano).fill(null).map((_, x: number): CasillaInfo => ({
                tipo: 'vacia',
                posicion: [x, y] as Posicion
            }))
        );
        
        // Configurar generadores
        this.configurarGeneradores();
        
        // Configurar reglas de fusión
        this.reglasFusion = new Map<string, ElementModel>();
        this.configurarReglasFusion();
    }
    
    private configurarGeneradores(): void {
        // Generador de fuego
        this.grid[0][0] = {
            tipo: 'generador',
            elemento: new ElementModel('fuego', '🌋'),
            posicion: [0, 0] as Posicion
        };
        
        // Generador de agua
        this.grid[0][5] = {
            tipo: 'generador',
            elemento: new ElementModel('agua', '☁️'),
            posicion: [5, 0] as Posicion
        };
    }
    
    private configurarReglasFusion(): void {
        // Agregar SOLO las reglas de fusión específicas de la tabla proporcionada
        this.agregarReglaFusion('agua', 'agua', new ElementModel('leche', '🥛', 2));
        this.agregarReglaFusion('fuego', 'fuego', new ElementModel('huevo', '🍳', 2));
        this.agregarReglaFusion('leche', 'leche', new ElementModel('agua_purificada', '🚰', 3));
        this.agregarReglaFusion('agua_purificada', 'agua_purificada', new ElementModel('camion', '🚛', 4));
        this.agregarReglaFusion('huevo', 'huevo', new ElementModel('pollo', '🍗', 3));
        this.agregarReglaFusion('pollo', 'pollo', new ElementModel('hamburguesa', '🍔', 4));
    }
    
    private agregarReglaFusion(tipo1: TipoElemento, tipo2: TipoElemento, resultado: ElementModel): void {
        // Usar una comparación manual en lugar de sort() para evitar problemas de tipado
        const tipoOrdenados: [TipoElemento, TipoElemento] = 
            tipo1 < tipo2 ? [tipo1, tipo2] : [tipo2, tipo1];
        const clave: string = `${tipoOrdenados[0]}-${tipoOrdenados[1]}`;
        this.reglasFusion.set(clave, resultado);
    }
    
    public generarElemento(x: number, y: number): ElementModel | null {
        const casilla: CasillaInfo = this.grid[y][x];
        if (casilla.tipo === 'generador' && casilla.elemento) {
            const tipoGenerado: TipoElemento = casilla.elemento.getTipo === 'fuego' ? 'fuego' : 'agua';
            const emojiGenerado: string = tipoGenerado === 'fuego' ? '🔥' : '💧';
            return new ElementModel(tipoGenerado, emojiGenerado, 1);
        }
        return null;
    }
    
    public obtenerElementoFusionado(tipo1: TipoElemento, tipo2: TipoElemento): ElementModel | null {
        // Usar una comparación manual en lugar de sort()
        const tipoOrdenados: [TipoElemento, TipoElemento] = 
            tipo1 < tipo2 ? [tipo1, tipo2] : [tipo2, tipo1];
        const clave: string = `${tipoOrdenados[0]}-${tipoOrdenados[1]}`;
        
        return this.reglasFusion.get(clave) || null;
    }
    
    public get getGrid(): CasillaInfo[][] {
        return this.grid;
    }
    
    public moverElemento(desdeX: number, desdeY: number, hastaX: number, hastaY: number): boolean {
        // Comprobamos si se está intentando mover a la misma posición
        if (desdeX === hastaX && desdeY === hastaY) {
            return false; // No hacemos nada si es la misma posición
        }
        
        const origen: CasillaInfo = this.grid[desdeY][desdeX];
        const destino: CasillaInfo = this.grid[hastaY][hastaX];
        
        if (origen.tipo !== 'elemento') return false;
        
        if (destino.tipo === 'vacia') {
            // Mover a casilla vacía
            this.grid[hastaY][hastaX] = {
                ...origen,
                posicion: [hastaX, hastaY] as Posicion
            };
            this.grid[desdeY][desdeX] = {
                tipo: 'vacia',
                posicion: [desdeX, desdeY] as Posicion
            };
            return true;
        } else if (destino.tipo === 'elemento' && origen.elemento && destino.elemento) {
            // Verificar que no son del mismo elemento (excepto en casos específicos de las reglas)
            const elemento1: ElementModel = origen.elemento;
            const elemento2: ElementModel = destino.elemento;
            
            // SOLO permitir fusiones que estén explícitamente en nuestras reglas
            // Esto evita fusiones de elementos arbitrarios o no permitidos
            const elementoFusionado: ElementModel | null = this.obtenerElementoFusionado(
                elemento1.getTipo, 
                elemento2.getTipo
            );
            
            // Solo permitir la fusión si existe una regla explícita para esta combinación
            if (elementoFusionado) {
                // Fusionar elementos
                this.grid[hastaY][hastaX] = {
                    tipo: 'elemento',
                    elemento: elementoFusionado,
                    posicion: [hastaX, hastaY] as Posicion
                };
                
                this.grid[desdeY][desdeX] = {
                    tipo: 'vacia',
                    posicion: [desdeX, desdeY] as Posicion
                };
                return true;
            }
        }
        
        return false;
    }
}