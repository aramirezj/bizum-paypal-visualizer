import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";

/** Clase utilizada para mostrar un select pro que haga asignación de elemento*/
export class SelectProTabla {
    constructor(
        /** Nombre del atributo del elemento al que asignarle el resultado de la selección */
        public columnaModelo: string,
        /** Nombre que tendrá la columna de la tabla */
        public columnaVisual: string,
        /** Nombre del atributo del elemento resultante de la petición para mostrar */
        public label: string,
        /** Nombre del modelo del elemento resultante de la petición para asignarselo al elemento de la tabla según la columnaModelo */
        public value: string,
        /** Petición del que el selectPro sacará los datos */
        public peticion: Observable<any>,
        /** Control asociado */
        public control?: FormControl
    ) {
        this.control = this.control ? this.control : new FormControl();
    }
}
