

/** Clase utilizada para recopilar los formatos que ha de usar una tabla */
export class FormatosTabla {
    constructor(
        /** Nombres de modelo que deberan llevar el formato de euros */
        public euros?: string[],
        /** Nombres de modelo que deberan llevar el formato de porcentaje */
        public porcentajes?: string[],
        /** Nombres de modelo que deberán llevar obligatoriamente cierto formato de fechas */
        public fechas?: string[]
    ) {
        this.euros = this.euros ? this.euros : [];
        this.porcentajes = this.porcentajes ? this.porcentajes : [];
        this.fechas = this.fechas ? this.fechas : []
    }

    /**
     * Según un atributo, devuelve que formato debe llevar
     * @param atributo Atributo que investigar
     * @returns Formato a usar
     */
    public getFormato(atributo: string): string {
        if (this.euros.includes(atributo)) return 'euro';
        else if (this.porcentajes.includes(atributo)) return 'porcentaje';
        else if (this.fechas.includes(atributo)) return 'date';
    }
}
