import { Accion } from "./Accion";

export class AccionCondicion {
    /** Resultado final de la condición, si es true, es deshabilitado */
    resultado: boolean;
    constructor(
        /** Atributo sobre el que se trabaja */
        public atributo: string,
        /** Tipo de condición que se está evaluando, puede ser boolean, equal, y different */
        public tipoCondicion: string,
        /** Logica de la condición, si el tipo es boolean, será required o missing, y si es equal o different, será a lo que tiene que ser igual o diferente */
        public logica: string,
        /** En el caso de tener una accion sustituta, cuando la lógica se cumpla, se sustituirá la acción */
        public accionSustituta?:Accion,
        /** Si tiene acción sustituta, al intercambiarse se deshabilitará la nueva */
        public deshabilitaSustituta?:boolean
    ) {
    }
}
