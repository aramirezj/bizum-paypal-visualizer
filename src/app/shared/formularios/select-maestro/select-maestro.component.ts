import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { PeticionExpansion } from '../../modelos/PeticionExpansion';

/** Selector génerico que admite tanto listados de elementos como APIs. */
@Component({
    selector: 'app-select-maestro',
    templateUrl: './select-maestro.component.html',
    styleUrls: ['./select-maestro.component.scss']
})
export class SelectMaestroComponent implements OnInit, OnDestroy {
    /** Datos recibidos */
    @Input() set datos(datos: any) { this._datos = datos ? datos : []; this.reInit.next(1) }
    /** Datos de origen, array plano o observable */
    @Input() _datos: any = [];
    /** Datos procesados, por si el origen era un observable */
    @Input() datosListado: any[] = [];
    /** Control de formulario asociado */
    @Input() control: FormControl = new FormControl();
    /** Si es un objeto, para al seleccionar un elemento del listado, el valor del formulario sea el valor de la propiedad de ese elemento */
    @Input() value: string;
    /** Si es un objeto, para saber que propiedad mostrar de ese objeto en el listado */
    @Input() label: string;
    /** Si es un objeto, para mostrar una segunda propiedad en el listado */
    @Input() secondLabel: string;
    /** Placeholder del selector */
    @Input() placeholder: string;
    /** Información abajo del selector  */
    @Input() hint: string;
    /** Para controlar que aparezca el buscador o no */
    @Input() buscador: boolean = true;
    /** Para controlar que el selector admita varias selecciones o no */
    @Input() multiple: boolean = false;
    /** Para pasarle un buscador customizado. Los parametros recibidos en la función de busqueda deben ser (term: string, item: any) */
    @Input() customSearch: any;

    /** USADO EN TABLA Elemento asociado al control. Su lógica es que en el valueChanges del formulario, asocie el resultado al elemento */
    @Input() elementoAsociado: any;
    /** USADO EN TABLA Codependiente del elementoAsociado, para saber a que atributo asignar */
    @Input() modeloAsociado: string;
    /** USADO EN TABLA, si es verdadero el select-maestro preseleccionara el unico elemento disponible si solo existe uno donde elegir */
    @Input() precargaUnico = false;
    /** USADO EN TABLA, si contiene una petición cambio, después del value changes, actualizará el elemento lanzando la api */
    @Input() peticionCambio: PeticionExpansion;
    /** USADO EN TABLA, para notificar el cambio del elemento completo y que la tabla haga una sustitución */
    @Output() elementoAsociadoCambiado: EventEmitter<any> = new EventEmitter();
    /** USADO EN TABLA, para cargarse luego la suscripción  */
    suscriptionChange: Subscription;


    /** Listado de datos que se mostarán en ese momento en el listado */
    datosFiltrados: any[];
    /** Instancia del input de busqueda */
    controlInput: FormControl = new FormControl();

    /** Para reiniciar el origen de datos **/
    reInit = new Subject<any>();

    /** Para cotejar los objetos por una PK */
    @Input() key: string;

    /** Para cotejar los objetos por una PK */
    @Input() preset: string;

    constructor() { }

    ngOnInit() {
        /** Para en linea principalmente, si tiene preset TV, cotejamos por valVal y devolvemos objeto entero */
        if (this.preset === 'TV') {
            this.key = this.key ?? 'valVal';
            this.label = this.label ?? 'valDesCom';
            this.value = null;
        }

        /** Si tiene un valor asignado, no nos hace falta key para cotejar */
        if (this.value) this.key = null;

        if (this.elementoAsociado) {
            const nuevoControl = new FormControl();
            if (this.control) {
                nuevoControl.statusChanges['observers'] = this.control.statusChanges['observers'];
                this.control = nuevoControl;
            } else {
                this.control = new FormControl(this.elementoAsociado[this.modeloAsociado]);
            }
        }

        this.compruebaOrigenDatos();
        this.reInit.subscribe(() => this.compruebaOrigenDatos());
        if (this.key) this.control['key'] = this.key;
    }

    ngAfterViewInit() {
        this.control.valueChanges.subscribe(nuevoValor => {
            if (this.elementoAsociado) {
                //Si tiene petición cambio y es de tabla, lanza una api y cambia el elemento en caso de detectar cambio
                if (this.peticionCambio && this.elementoAsociado[this.modeloAsociado] !== nuevoValor) {
                    const posibleRollBack: any = Object.assign({}, this.elementoAsociado);
                    this.elementoAsociado[this.modeloAsociado] = nuevoValor;
                    const params: any[] = this.peticionCambio.preparaParametros(this.elementoAsociado);
                    this.suscriptionChange = this.peticionCambio.peticion(...params).subscribe({
                        next: (nuevoElemento) => {
                            this.elementoAsociadoCambiado.emit({ viejo: this.elementoAsociado, nuevo: nuevoElemento });
                        },
                        error: (err) => {
                            this.elementoAsociado = posibleRollBack;
                            this.control.setValue(posibleRollBack[this.modeloAsociado], { emitEvent: false });
                        }

                    });
                }
            }

        });
    }

    ngOnDestroy(): void {
        if (this.suscriptionChange) this.suscriptionChange.unsubscribe();
    }


    /** Comprueba si los datos se han pasado es un listado de datos o un observable */
    compruebaOrigenDatos(): void {
        if (Array.isArray(this._datos)) {
            this.datosListado = this._datos as [];
            this.datosFiltrados = this.datosListado;
        } else {
            //Proviene de tablas, tiene PeticionExpansion
            if (this.elementoAsociado) {
                const peticionExpansion = this._datos as PeticionExpansion;
                const params: any[] = peticionExpansion.preparaParametros(this.elementoAsociado);
                //nos suscribimos y lo asignamos
                peticionExpansion.peticion(...params).subscribe(data => {
                    this.datosListado = data;
                    this.datosFiltrados = this.datosListado;
                    //Tenemos que buscar del listado lo que tiene asociado y setearlo al formulario sin enviar evento
                    if (this.elementoAsociado[this.modeloAsociado]) {
                        const datoCotejado = this.datosFiltrados.find(dato => dato[this.value] === this.elementoAsociado[this.modeloAsociado]);
                        this.control.setValue(datoCotejado[this.value], { emitEvent: false });
                    }
                });
            } else {
                //nos suscribimos y lo asignamos
                this._datos.subscribe(data => {
                    //No asignamos el value ya que queremos que nos lo devuelva entero, asignamos la key para que el cotejamiento sea correcto igualmente.
                    this.datosListado = data;
                    this.datosFiltrados = this.datosListado;
                });
            }

        }
    }


    /** Función lanzada al pulsar la X del selector. Reiniciamos todo. */
    reinicia() {
        this.control.setValue(null);
        this.controlInput.setValue(null);
        //Touched para mostrar error
        this.control.markAllAsTouched();
        //Dirty para cambiar pristine y dirty
        this.control.markAsDirty();
        this.datosFiltrados = this.datosListado.slice();
    }
    /**
     * Evento que se lanza al abrir y cerrar el selector. Al cierre, reiniciamos buscador y listado filtrado
     * @param abierto Si se ha abierto
     */
    toggledSelect(abierto: boolean): void {
        if (!abierto) this.controlInput.reset();
        this.datosFiltrados = this.datosListado.slice();
    }

    /**
     * Función de busqueda, el valor escrito lo pasa a minuscula, y compara los objetos. Si label está setted, filtra por los label
     * @param value Valor escrito
     */
    search(value: string): void {
        if (this.customSearch) {
            //Es una busqueda customizadas, por lo que en el segundo parametro pasamos la query
            this.datosFiltrados = this.datosListado.filter(this.customSearch.bind(null, value))
        } else {
            let filter = value.toLowerCase();
            if (!this.secondLabel) {
                this.datosFiltrados = this.datosListado.filter(option =>
                    this.label ? option[this.label].toLowerCase().indexOf(filter) > -1 : option.toLowerCase().indexOf(filter) > -1
                );
            } else {
                this.datosFiltrados = this.datosListado.filter(option =>
                    option[this.label]?.toLowerCase().indexOf(filter) > -1 || option[this.secondLabel]?.toLowerCase().indexOf(filter) > -1
                );
            }

        }

    }

    /**
     * Función para comparar dos objetos. Si el selector tiene un value seteado, lo cogerá de la propiedad
     * key del select asignado previamente. Compara los objetos ya sea por entero o por key
     * @param o1 Objeto 1
     * @param o2 Objeto 2
     * @returns Si son iguales
     */
    compareObjects(o1: any, o2: any): boolean {
        const key: string = this['ngControl']['form']['key'];
        if (o1 && o2) {
            if (key) {
                if (o1[key] !== undefined && o1[key] !== null) {
                    return o1[key] === o2[key];
                }
            } else {
                return o1 === o2;
            }

        }

    }


}
