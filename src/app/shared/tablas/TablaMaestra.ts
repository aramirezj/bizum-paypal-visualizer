import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { BuscadorComponent } from '../formularios/buscador/buscador.component';
import { Accion } from '../modelos/Accion';
import { FiltroAvanzado } from '../modelos/FiltroAvanzado';
import { FormatosTabla } from '../modelos/FormatosTabla';
import { Formulario, TF } from '../modelos/Formulario';
import { ObjetoTabla } from '../modelos/ObjetoTabla';
import { PeticionPaginacion } from '../modelos/PeticionPaginacion';
import { SelectProTabla } from '../modelos/SelectProTabla';
import { SharedService } from '../shared.service';


/** Tabla Maestra de la que partirán las demás implementando sus atributos y funciones comunes */
@Component({
  template: ''
})
export class TablaMaestra {
  /** Visibilidad del componente de busqueda */
  @ViewChild(BuscadorComponent, { static: false }) buscadorApp: BuscadorComponent;
  /** Visibilidad del paginador */
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  /** Atributo con la colección de datos a mostrar */
  @Input() datos: any[] = [];
  /** Columnas a mostrar en la tabla */
  @Input() visual: string[];
  /** Columnas del modelo de la colección que recibe */
  @Input() modelo: string[];
  /** Acciones que deberán estar disponibles */
  @Input() acciones: string[];
  /** Listado de acciones con condiciones */
  @Input() accionesCondicionales: Accion[];
  /** Habilita o deshabilita el buscador de la tabla */
  @Input() buscador: boolean = false;
  /** Formatos a utilizar en la tabla (Euro,porcentaje,etc) */
  @Input() formatos: FormatosTabla;
  /** Formulario que se podrá incluir en el formulario, para, si llama a editarT, invoque el formulario para su edición */
  @Input() formulario: Formulario;
  /** Clave primaria que tendrá la tabla. Se utilizará en las inserciones por método y edición */
  @Input() clavePrimaria: string;
  /** Petición asincrona para cargar datos y paginador según peticiones HTTP */
  @Input() paginacionAsincrona: PeticionPaginacion = null;
  /** Permite que en la tabla, se puede hacer clic para seleccionar un elemento, y enviarlo */
  @Input() seleccionable: boolean;
  /** Control de paginación */
  @Input() paginador: boolean = true;
  /** Recibe un elemento para que, al cargar la tabla, se preseleccione y mande el evento */
  @Input() elementoPreseleccionado: any;
  /** Atributo para cargar objetos complejos a las tablas */
  @Input() objetos: ObjetoTabla[];
  /** Atributo para cargar selects pro a las tablas */
  @Input() selectsPro: SelectProTabla[];
  /** En el caso de ser una tabla hija, emitira valor al cargar */
  @Input() subjectLoaded: BehaviorSubject<any>;
  /** Filtros para usar en el filtro avanzado */
  @Input() filtroAvanzado: FiltroAvanzado;
  /** Elemento para notificar al componente que invoca la tabla */
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  /** Elemento para notificar un requerimiento de tratamiento de datos después de paginar o filtrar */
  @Output() tratamiento: EventEmitter<any[]> = new EventEmitter<any[]>();
  /** Acciones listas para recorrerlas */
  accionesParsed: Accion[];
  /** Lista de acciones que es capaz de gestionar la tabla por si sola, si no está, enviará el evento y yasta */
  accionesAutoGestionadas: string[] = ['subir', 'bajar', 'eliminarT', 'eliminar', 'editarT'];
  /** Opciones posible para la paginación */
  pageSizeOptions: number[] = [5, 10, 25, 100];
  /** Control de la configuración de la paginación */
  pageEvent: PageEvent = { length: 0, pageSize: 5, pageIndex: 0 };
  /** Para tener constancia de cual es la ordenación que se está teniendo ahora mismo */
  ordenacionActual: Sort;
  /** Cadena de busqueda actualizada por la app-buscador */
  cadenaBusqueda: string;
  /** Datos a visualizar en la tabla */
  datosAMostrar: any[] = this.datos;
  /** Atributo auxiliar para tener en constancia que elemento ha sido seleccionado */
  elementoSeleccionado: any;
  constructor(
    public sharedService: SharedService
  ) { }

  /**
  * Lógica para la paginación. Si recibe una pagina, la asigna, si no, la crea según los datos actuales
  *
  * @param page Página recibida y a asignar
  */
  paginacion(page?: PageEvent): void {
    this.pageEvent = page ? page : this.pageEvent;
    if (this.paginacionAsincrona) {
      const paramsR: string[] = this.paginacionAsincrona.params;
      let filterValue = this.cadenaBusqueda;
      filterValue = filterValue ? filterValue.trim().toUpperCase() : '';
      this.paginacionAsincrona.peticion(
        this.pageEvent.pageIndex,
        this.pageEvent.pageSize,
        this.ordenacionActual?.active ? this.ordenacionActual.active : this.paginacionAsincrona?.orden?.campos ? this.paginacionAsincrona.orden.campos[0] : null,
        this.ordenacionActual?.direction ? this.ordenacionActual.direction : 'DESC',
        [filterValue],
        ...paramsR
      ).subscribe(newData => {
        this.datosAMostrar = newData.datos;
        this.paginacionAsincrona.paginacion = newData.pagina;
        this.paginacionAsincrona.orden = newData.orden;
        this.pageEvent.length = this.paginacionAsincrona.paginacion.numeroRegistrosTotal;
        if (this.paginacionAsincrona.funcionalidadExterna) { this.tratamiento.emit(this.datosAMostrar) };
      });
    }
  }

  /** Restablece la paginación */
  reiniciaPaginacion(): void {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.length = this.paginacionAsincrona ? this.paginacionAsincrona.paginacion.numeroRegistrosTotal : this.datosAMostrar.length;
  }

  /**
  * Lógica para la ordenación de los datos
  *
  * @param ordena
  */
  ordenacion(ordena: Sort): void {
    this.ordenacionActual = ordena;
    if (this.paginacionAsincrona) {
      this.paginacion();
    } else {
      if (this.ordenacionActual) {
        if (!this.cadenaBusqueda) {
          if (ordena.direction === 'asc') this.datosAMostrar = this.datos.sort((a, b) => (a[ordena.active] > b[ordena.active]) ? 1 : -1);
          else this.datosAMostrar = this.datos.sort((a, b) => (a[ordena.active] < b[ordena.active]) ? 1 : -1);
        } else {
          if (ordena.direction === 'asc') this.datosAMostrar.sort((a, b) => (a[ordena.active] > b[ordena.active]) ? 1 : -1);
          else this.datosAMostrar.sort((a, b) => (a[ordena.active] < b[ordena.active]) ? 1 : -1);
        }
      }

    }
  }

  /**
  * Lógica para el filtrado de datos. Básicamente crea una copia original, sobre la que trabaja
  * convirtiendo luego en json para un mejor filtrado de datos
  *
  * @param valor Valor sobre el que filtrar
  */
  busqueda(result: { tipo: string, resultado: any }): void {
    if (result.tipo === 'simple') this.cadenaBusqueda = result.resultado;
    if (!this.paginacionAsincrona) {
      this.datosAMostrar = this.datos.filter((data) => JSON.stringify(data).toLowerCase().includes(this.cadenaBusqueda));
      this.reiniciaPaginacion();
    } else {
      this.pageEvent.pageIndex = 0;
      this.paginacion(this.pageEvent);
    }
  }

  /**
  * Realiza la sustitución de un nuevo elemento. Se utiliza por ejemplo cuando no se usa EditorGenerico, o cuando hay que hacerle rollback a un elemento
  *
  * @param viejoElemento Elemento antiguo que buscar
  * @param nuevoElemento Elemento nuevo
  */
  sustituyeElemento(viejoElemento: any, nuevoElemento: any): void {
    const index: number = this.datos.indexOf(viejoElemento);
    if (index != -1) {
      this.datos[index] = nuevoElemento;
      this.datosAMostrar = this.datos.slice();
    } else {
      this.sharedService.openSnackBar('No se ha encontrado el elemento a sustituir', 3);
    }
  }

  /**
 * Lógica para añadir a la tabla un nuevo elemento. Si lleva clave primaria, no lo insertará si su clave está repetida
 *
 * @param elemento Elemento a añadir
 */
  addNuevoElemento(elemento: any): void {
    if (this.clavePrimaria) {
      if (!this.sharedService.findRepeat(this.datos.slice().concat([elemento]), this.clavePrimaria)) {
        this.inserta(elemento);
      }
    } else {
      this.inserta(elemento);
    }
  }

  /**
 * Realiza una insercción
 *
 * @param elemento Elemento a insertar
 */
  inserta(elemento: any): void {
    this.datos.push(elemento);
    this.datosAMostrar = this.datos.slice();
    this.pageEvent.length = this.datos.length;
    this.ordenacion(this.ordenacionActual);
    this.sharedService.openSnackBar('Se ha insertado correctamente', 3);
  }

  /**
  * Borra un elemento de la tabla
  * @param elemento Elemento a borrar
  */
  borraElemento(elemento: any): void {
    const result = this.datosAMostrar.splice(this.datosAMostrar.indexOf(elemento), 1);
    this.pageEvent.length--;
    this.ordenacion(this.ordenacionActual);
    if (result) this.sharedService.openSnackBar('Se ha eliminado correctamente', 3);
    const isEmpty: boolean = (this.pageEvent.pageIndex * this.pageEvent.pageSize) >= this.pageEvent.length;
    if (isEmpty) {
      this.pageEvent.pageIndex--;
      this.paginacion(this.pageEvent);
    }
  }

  /** Comprueba las condiciones de las acciones para volver a evaluar */
  compruebaCondiciones(): void {
    if (this.accionesCondicionales) {
      this.accionesCondicionales.forEach(accion => { if (accion.observerCondiciones) accion.observerCondiciones.next(1) });
    }
  }

  /**
 * Apertura de un modal para inspeccionar un atributo complejo del elemento principal
 *
 * @param elemento Elemento padre
 * @param posicion Posición del elemento
 */
  openInspeccion(elemento: any, posicion: number): void {
    const objTabla = this.objetos[posicion];
    const form = new Formulario(TF.INSPECCION, objTabla.columnasModelo, objTabla.columnasVisuales, `Inspección de ${objTabla.nombreVisual}`);
    if (elemento[objTabla.nombreModelo]) {
      if (objTabla.peticion) {
        const params = []
        objTabla.peticion.params.map(claveParam => {
          params.push(elemento[claveParam])
        });

        objTabla.peticion.peticion(...params).subscribe(resp => {
          form.elemento = resp;
          this.sharedService.muestraFormulario(form).subscribe();
        }
        );
      } else {
        form.elemento = elemento[objTabla.nombreModelo];
        this.sharedService.muestraFormulario(form).subscribe();
      }
    } else {
      this.sharedService.openSnackBar('Este elemento no tiene ' + objTabla.nombreVisual, 3);
    }
  }

  /** Función para ejecutar desde componentes padres para emitir una deselección */
  deselecciona() {
    this.elementoSeleccionado = null;
    this.notify.emit({ accion: 'configurar', elemento: this.elementoSeleccionado });
  }

  /**
  * Método para buscar un elemento y recuperarlo
  * @param field Campo por el que filtrar
  * @param value Valor
  * @returns Elemento en cuestión
  */
  recuperaElemento(field: string, value: any): any {
    const elemento: any = this.datosAMostrar.find(dato => dato[field] === value);
    if (elemento) return elemento;
    else this.sharedService.openSnackBar('No se ha encontrado el elemento a recuperar', 3);
  }



}
