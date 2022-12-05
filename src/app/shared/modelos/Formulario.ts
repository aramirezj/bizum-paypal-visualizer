import { ValidatorFn, Validators } from '@angular/forms';
import { ElementoFormulario } from './ElementoFormulario';
import { PeticionExpansion } from './PeticionExpansion';

/** Lista de controles que soporta el modelo Formulario */
export enum TC {
    TEXTO = 'texto',
    NUMERO = 'numero',
    EURO = 'euro',
    PORCENTAJE = 'porcentaje',
    ORDEN = 'orden',
    CHECKBOX = 'checkbox',
    FECHA = 'fecha',
    SELECT = 'select',
    SELECTOBJETO = 'selectObjeto',
    SELECTBOOLEAN = 'selectBoolean',
    SELECTMAESTRO = 'selectMaestro',
    SELECTAUTOCOMPLETADO = 'selectAutocompletado',
    PLANO = 'plano',
    TEXTAREA = 'textArea',
    SLIDER = 'slider',
    identificador = 'identificador',
    NIE = 'NIE',
    CIF = 'CIF'
}

/** Lista de formatos de los tipos de controles */
export enum TC_F {
    MAYUSCULA = 'mayuscula',
    MINUSCULA = 'minuscula',
    NUMERO = 'numero',
    EURO = 'euro',
    PORCENTAJE = 'porcentaje',
    ORDEN = 'orden',
    ESPACIO = 'espacio',
    MAYUSCULAESPACIO = 'mayusculaEspacio',
    MINUSCULAESPACIO = 'minusculaEspacio',
    identificador = 'identificador',
    NIF = 'NIF',
    NIE = 'NIE',
    CIF = 'CIF'
}

/** Listado de tipos posibles para un Formulario */
export enum TF {
    CREACION = 'creacion',
    EDICION = 'edicion',
    INSPECCION = 'inspeccion'
}

/** Clase utilizada para la gestión de formularios genéricos y especificos, mostrandose luego en EditarGenericoComponent */
export class Formulario {
    /** Elemento que se trata en caso de ser de tipo edición o inspección el formulario */
    elemento: any;
    /** Lista de ElementoFormulario con el que trabaja */
    controles: ElementoFormulario[] = [];
    /** Elemento original, se utiliza en los formularios de edición para tener constancia del elemento original */
    elementoOriginal: any;
    /** Número de columnas que tendrá el formulario a mostrar */
    numeroColumnas: number = 1;
    /** Opción exclusiva para los requerimientos. Contiene la tabla asociada  */
    requerir: string;
    /** Primary key del elemento */
    idRequerir: string;
    /** Conjunto de peticiones para ejecutar al previo cierre del dialogo, se ordenan según el tipo del formulario */
    peticionesAPI?: {
        creacion?: PeticionExpansion,
        edicion?: PeticionExpansion
    } = {};
    /** En el caso de estar seteado se permitirá el borrado con la petición definida en peticionesAPI de edición*/
    permiteBorrado?: boolean = false;
    /** Funciones extras que se ejecutarán a través de botones */
    extraActions: { label: string, function: Function, close: boolean }[] = [];
    constructor(
        public tipo: TF | string,
        public modelo: string[],
        public visual: string[],
        public titulo: string,
        public aceptar?: boolean,
    ) {
        this.modelo = modelo.map(this.sanitizaModelo);
        this.modelo.forEach(atributo => {
            this.addElemento(atributo, new ElementoFormulario(atributo, TC.TEXTO, this.tipo === TF.INSPECCION));
        });
        this.visual.forEach(atributo => atributo = atributo.replace('<br>', ' '));
        this.elemento = {};
    }

    /**
     * Si el modelo que nos han pasado, se usa en tablas, puede ser que tenga anidación compleja y use los puntos
     * Aquí nos lo cargamos para poder usarlo bien
     * @param modelo Modelo a usar
     */
    sanitizaModelo(modelo: string) {
        return modelo.split('.')[0];
    }

    /**
     * REMPLAZA una serie de validaciones a una serie de atributos. IMPORTANTE, REMPLAZA, no agrega
     *
     * @param validaciones Lista de Validators
     * @param atributos Lista de nombres de atributos de los campos
     */
    setValidaciones(validaciones: ValidatorFn[], atributos?: string[]): void {
        atributos ?
            atributos.forEach(atributo => this.getElemento(atributo).control.setValidators(validaciones)) :
            this.modelo.forEach(atributo => this.getElemento(atributo).control.setValidators(validaciones))
    }
    /**
     * Agrega la validación Obligatorio a una serie de controles
     *
     * @param atributos Lista de controles
     */
    addRequired(atributos: string[]): void {
        atributos.forEach(atributo => this.getElemento(atributo).control.setValidators([Validators.required]));
    }

    /**
     * Recupera un elemento del formulario
     *
     * @param elemento Nombre del elemento a recuperar
     */
    getElemento(elemento: string): ElementoFormulario {
        return this.controles[elemento];
    }

    /**
     * Inserta/Sustituye un elemento personalizado en el formulario.
     *
     * En caso de que el elemento ya exista, se conserva su configuración de FxFlex previa.
     *
     * @param nombre nombre del control del elemento
     * @param elemento elemento a insertar
     */
    addElemento(nombre: string, elemento: ElementoFormulario): ElementoFormulario {
        if (this.controles[nombre]) {
            elemento.fxFlex = this.controles[nombre].fxFlex;
        }
        this.controles[nombre] = elemento;
        return elemento;
    }
    /**
     * Inserta un elemento personalizado en el formulario
     *
     * @param nombre nombre del control del elemento
     * @param elemento elemento a insertar
     */
    addElementos(nombres: string[], elementos: ElementoFormulario[]): void {
        let i = 0;
        nombres.forEach(nombre => { this.controles[nombre] = elementos[i]; i++; });
    }

    /**
     * Deshabilita una lista de controles
     *
     * @param atributos Lista de nombre de controles
     */
    deshabilitaControles(atributos?: string[]): void {
        atributos = atributos ?? this.modelo;
        atributos.forEach(atributo => {
            this.getElemento(atributo).disabled = true;
            this.getElemento(atributo).control.disable();
        });
    }

    /**
     * Habilita una lista de controles
     *
     * @param atributos Lista de nombre de controles
     */
    habilitaControles(atributos: string[]): void {
        atributos.forEach(atributo => {
            this.getElemento(atributo).control.enable();
            this.getElemento(atributo).disabled = false;
        });
    }

    /**
     * Cambia el tipo de control a una serie de controles
     *
     * @param tipo Tipo al que cambiar. EJ: 'fecha | euro | porcentaje | orden | texto | numero | checkbox | select | selectPro | selectBooleano'
     * @param atributos Lista de nombres de controles
     */
    cambiarTipo(tipo: TC | string, atributos: string[]): void {
        if (tipo === TC.EURO || tipo === TC.PORCENTAJE || tipo === TC.ORDEN) {
            atributos.forEach(atributo => {
                const ele: ElementoFormulario = this.getElemento(atributo);
                if (ele) ele.setFormatoNumero(tipo);
            });
        } else {
            atributos.forEach(atributo => { if (this.getElemento(atributo)) this.getElemento(atributo).tipo = tipo });
        }

    }

    /**
     * Cambia el tipo de formulario que es
     *
     * @param elemento Elemento asociado por si es de edición o inspección
     * @param tipo Tipo de formulario, puede ser creación, edición e inspección
     * @param titulo Titulo a mostrar para el formulario
     */
    cambiarTipoFormulario(elemento?: any, tipo?: TF | string, titulo?: string): void {
        if (this.tipo === TF.INSPECCION && tipo !== TF.INSPECCION) {
            for (const value of Object.values(this.controles)) {
                value.disabled = false;
                value.control.enable();
            }
        }
        this.elemento = elemento;
        this.tipo = tipo ? tipo : this.tipo;
        this.titulo = titulo ? titulo : this.titulo;
    }

    /**
     * Cambia las columnas de modelo y visuales para el formulario
     * @param modelo Columnas modelo
     * @param visual Columnas visuales
     */
    cambiarColumnas(modelo: string[], visual: string[]) {
        this.modelo = modelo;
        this.visual = visual;
    }

    /**
     * Para cambiar el formato que pueden tener los campos
     *
     * @param formato Formato a asignar. EJ: 'euro'
     * @param atributos Lista de nombres de controles al que modificarselo
     * @param mask Objeto opcional con parametros especificos de formato (suffix, decimal, thousands...)
     */
    setFormato(formato: TC | string, atributos: string[], mask?: object): void {
        atributos.forEach(atributo => this.getElemento(atributo).setFormatoNumero(formato, mask));
    }

    /**
     * Para cambiar el tamaño de los campos, especificandose por número de orden
     *
     * @param fxFlexes Lista de tamaños
     */
    setFxFlexes(fxFlexes: number[]): void {
        for (let i = 0; i < fxFlexes.length; i++) {
            if (this.controles[this.modelo[i]]) this.controles[this.modelo[i]].fxFlex = fxFlexes[i];
        }
    }

    /** Limpia los controles actuales */
    eliminaControles() {
        this.controles = [];
    }

}
