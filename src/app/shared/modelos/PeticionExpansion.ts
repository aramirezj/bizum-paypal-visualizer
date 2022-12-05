/** Clase utilizada para la expansión asincrona de una tabla de expansión */
export class PeticionExpansion {
    constructor(
        /** Función inyectada de un servicio para obtener datos */
        public peticion: Function,
        /** Parametros que pueda necesitar la query. Puede usarse 'OBJECT' para utilizar el elemento entero como parámetro. */
        public params?: string[],
        /** Usado en TABLA INFINITA, lista de atributos del padre que se asigarán a los hijos*/
        public herencias?: string[],
        /** Lista de pares clave: valor que se setearan en el elemento y podrán usarse como params */
        public parametersToElement?: {},
        /** Lista de pares clave: valor que podrán usarse como params directamente en la API. NO añaden información al elemento*/
        public parametersToPath?: {},
    ) {

    }

        /**
     * Función que retorna en un listado, los valores finales que deberá enviar una petición expansión
     * @param elemento Elemento base del que partir
     * @returns Listado de elementos para la petición
     */
         preparaParametros(elemento: any): any[] {
            //Listado de valores finales que se enviarán
            const valoresPeticion: any[] = [];
            //Si hay una serie de parametros con valores predeterminados, estos valores se asignan
            //al elemento base
            if (this.parametersToElement) {
                for (const key of Object.keys(this.parametersToElement)) {
                    elemento[key] = this.parametersToElement[key];
                }
            }
    
            //Se leen los parametros definidos para esta petición
            for (const param of this.params) {
                //Si es de tipo OBJECT, como valor se añadirá el objeto entero
                if (param === 'OBJECT') {
                    valoresPeticion.push(elemento);
                } else {
                    //Si el atributo parametersToPath está seteado, en vez de añadir valores predeterminados al elemento,
                    //se añaden a la petición difectamente
                    if (this.parametersToPath) {
                        if (param in this.parametersToPath) {
                            valoresPeticion.push(this.parametersToPath[param]);
                        } else {
                            valoresPeticion.push(this.recuperaParametro(param, elemento));
                        }
                        //Valores base
                    } else {
                        valoresPeticion.push(this.recuperaParametro(param, elemento));
                    }
                }
            };
            return valoresPeticion;
        }
    
        /**
         * Evalua si el parametro que debe sacar está anidado, si lo está, lo saca
         * @param modelo Modelo que evaluar
         * @param elemento Elemento completo
         * @returns Valor que irá en la petición
         */
        recuperaParametro(modelo: string, elemento: any) {
            const splitted: string[] = modelo.split('.');
            let toReturn: any;
            if (splitted.length > 1) {
                toReturn = elemento[splitted[0]]?.[splitted[1]];
            } else {
                toReturn = elemento[modelo];
            }
            return toReturn;
        }
}
