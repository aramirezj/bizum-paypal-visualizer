import { FormControl, FormGroup } from "@angular/forms";

/** Clase utilizada por el componente App-Buscador en el modo avanzado para el listado de campos filtrables */
export class FiltroAvanzado {
    /** Estructura de los campos */
    campos: { modelo: string, visual: string, activo: boolean, valor?: string }[];
    /** Instancia del formulario */
    form: FormGroup;
    constructor(
        /** Campos de modelo de los atributos a filtrar */
        public modelo: string[],
        /** Campos visuales de los atributos a filtrar */
        public visual: string[]
    ) {
        this.campos = [];
        this.form = new FormGroup({});
        for (let i = 0; i < this.modelo.length; i++) {
            this.campos.push({ modelo: this.modelo[i], visual: this.visual[i], activo: false });
        }
    }

    /**
     * Gestiona los clicks de un campo para crear y borrar el control
     * @param campo Campo a tratar
     */
    gestionaCampo(campo: { modelo: string, visual: string, activo: boolean }): void {
        if (!campo.activo) this.form.addControl(campo.modelo, new FormControl());
        else this.form.removeControl(campo.modelo);
        campo.activo = !campo.activo;
    }

}
