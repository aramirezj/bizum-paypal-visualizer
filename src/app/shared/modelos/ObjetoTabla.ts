import { PeticionExpansion } from './PeticionExpansion';
/** Clase utilizada para que un atributo de una fila de una tabla, pueda ser un objeto complejo y se pueda inspeccionar */
export class ObjetoTabla {
    constructor(
        /** Nombre del atributo del que sacar el dato que se mostrará en la fila */
        public nombreAMostrar: string,
        /** Nombre del atributo del padre del que sacar los datos */
        public nombreModelo: string,
        /** Nombre que tendrá la columna del padre */
        public nombreVisual: string,
        public columnasVisuales: string[],
        public columnasModelo: string[],
        public peticion?: PeticionExpansion
    ) {

    }
}
