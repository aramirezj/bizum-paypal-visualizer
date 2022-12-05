import { trigger, transition, style, animate } from '@angular/animations';
import { Component, Input, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Accion } from '../../modelos/Accion';
import { FiltroAvanzado } from '../../modelos/FiltroAvanzado';
import { Formulario, TF } from '../../modelos/Formulario';
import { PeticionExpansion } from '../../modelos/PeticionExpansion';
import { SelectProTabla } from '../../modelos/SelectProTabla';
import { SharedService } from '../../shared.service';

import { TablaComponent } from '../tabla/tabla.component';
import { TablaMaestra } from '../TablaMaestra';

/** Componente de la Tabla encargada del listado y tratado de elementos */
@Component({
  selector: 'arja-tabla-infinita',
  templateUrl: './tabla-infinita.component.html',
  styleUrls: ['./tabla-infinita.component.scss'],
  animations: [
    trigger('inOutAnimation',
      [transition(':enter',
        [
          style({ opacity: 0 }),
          animate('0.4s ease-out',
            style({ opacity: 1 }))
        ]),
      transition(':leave',
        [
          style({ opacity: 1 }),
          animate('0.4s ease-in',
            style({ opacity: 0 }))
        ]
      )])
  ]
})
export class TablaInfinitaComponent extends TablaMaestra {
  /** Instancia de la Tabla Hija */
  @ViewChild(TablaComponent, { static: false }) tablaHija: TablaComponent;
  /** Instancia de la Tabla Infinita hija */
  @ViewChild(TablaInfinitaComponent, { static: false }) tablaInfinitaHija: TablaInfinitaComponent;
  /** Acciones con condiciones */
  @Input() nivelesAccionesCondicionales: Accion[][];
  /** Acciones que se iran sumando a las tablas hijas */
  @Input() nivelesAcciones: Array<string[]>;
  /** Niveles de conjuntos de selects pro para ir transmitiendoselas a las tablas hijas */
  @Input() nivelesSelectsPro: SelectProTabla[][];
  /** Columnas a mostrar en la tabla */
  @Input() visuales: string[][];
  /** Columnas del modelo de la colección que recibe */
  @Input() modelos: string[][];
  /** Colección para saber los nombres de los atributos de los cuales ir sacando las anidaciones */
  @Input() niveles: string[];
  /** Colección para saber los titulos de las siguientes tablas */
  @Input() nivelesTitulos: string[];
  /** Petición que se ejecutará al expandir la tabla */
  @Input() peticionExpansion: PeticionExpansion;
  /** Atributo para ir teniendo constancia de en que paso de la anidación estamos, comienza en 0 */
  @Input() indiceAnidacion: number = 0;
  /** Colección de peticiones de expansion de las cuales ir anidando */
  @Input() peticionesInfinitas: PeticionExpansion[];
  /** Flag que indicará si los hijos siempre serán iguales al padre */
  @Input() herencia: boolean;
  /** Columnas visuales de la tabla actual */
  override visual: string[];
  /** Columnas modelo de la tabla actual */
  override modelo: string[];
  /** Acciones que deberán estar disponibles */
  override acciones: string[];
  /** Listado de acciones con condiciones */
  override accionesCondicionales: Accion[];
  /** Titulo usado para dar informacion de las tablas hijas */
  tituloHijo: string;
  /** Filtros para usar en el filtro avanzado */
  @Input() override filtroAvanzado: FiltroAvanzado;
  /** Atributo para tener constancia cual será la siguiente anidación */
  nextTabla: string;
  /** Si está a true, significa que la siguiente anidación, es otra tabla de expansión */
  nextTablaInfinita: boolean = false;
  /** Subject para controlar cuando la tabla hija se ha cargado */
  childrenLoaded: BehaviorSubject<any> = new BehaviorSubject(0);

  constructor(
    public override sharedService: SharedService
  ) {
    super(sharedService);
  }

  ngOnInit(): void {
    this.seleccionable = true;
    this.preparaTabla();
  }

  ngAfterViewInit(): void {
    if (this.elementoPreseleccionado) this.seleccion(this.elementoPreseleccionado);
  }

  /** Preparación inicial de herramientas necesarias para la tabla */
  preparaTabla(): void {
    this.datos = this.datos ? this.datos : [];
    this.datosAMostrar = this.datos.slice();

    this.pageEvent.length = this.datosAMostrar?.length;
    this.pageEvent.pageIndex = 0;
    if (this.paginacionAsincrona) {
      this.pageEvent.length = this.paginacionAsincrona.paginacion.numeroRegistrosTotal;
    } else {
      this.paginacion(this.pageEvent);
    }

    this.modelo = this.modelos[this.indiceAnidacion].slice();
    this.visual = this.visuales[this.indiceAnidacion].slice();
    this.nivelesAcciones = this.nivelesAcciones ? this.nivelesAcciones : [];
    this.accionesParsed = this.nivelesAccionesCondicionales ? this.nivelesAccionesCondicionales[this.indiceAnidacion] : this.sharedService.parseAcciones(this.nivelesAcciones[this.indiceAnidacion]);
    this.accionesCondicionales = this.nivelesAccionesCondicionales ? this.nivelesAccionesCondicionales[this.indiceAnidacion] : this.accionesCondicionales;
    this.nextTabla = this.niveles[this.indiceAnidacion];
    this.tituloHijo = this.nivelesTitulos[this.indiceAnidacion];
    if (this.peticionesInfinitas) this.peticionExpansion = this.peticionesInfinitas[this.indiceAnidacion]
    if (!this.herencia) this.indiceAnidacion++;
    if (this.niveles[this.indiceAnidacion]) this.nextTablaInfinita = true;

  }
  /**
   * Lógica para el refresco de la tabla entera según datos que haya recibido
   *
   * @param datos Datos nuevos
   */
  refrescaTabla(datos: any): void {
    this.datos = datos ? datos : [];
    this.datosAMostrar = this.datos.slice();
    if (this.buscadorApp) this.buscadorApp.form.reset();
    this.reiniciaPaginacion();
    this.refrescaTablasHijas();
  }

  refrescaTablasHijas(): void {
    if (this.tablaHija) this.tablaHija.refrescaTabla(this.tablaHija.datos);
    if (this.tablaInfinitaHija) this.tablaInfinitaHija.refrescaTabla(this.tablaInfinitaHija.datos);
  }

  /**
   * Evento de notificación de cuando se ha realizado una acción
   *
   * @param elemento Elemento sobre el cual se va a realizar la acción
   * @param accion Acción a realizar y devolver
   */
  doAccion(elemento: any, accion: string): void {
    if (!this.accionesAutoGestionadas.includes(accion)) {
      this.enviaNotificacion({ accion, elemento });
    } else {
      switch (accion) {
        case 'eliminarT':
          this.sharedService.muestraConfirmacion('eliminarGenerico2', elemento, this.modelo[0], this.visual[0]).subscribe(accept => {
            if (accept) {
              this.borraElemento(elemento)
              this.enviaNotificacion({ accion, elemento });
            }
          });
          break;
        case 'eliminar':
          this.sharedService.muestraConfirmacion('eliminarGenerico2', elemento, this.modelo[0], this.visual[0]).subscribe(accept => {
            if (accept) {
              this.enviaNotificacion({ accion, elemento });
            }
          });
          break;
        case 'editarT':
          if (this.formulario) {
            this.formulario.elemento = elemento;
            this.sharedService.muestraFormulario(this.formulario).subscribe(dialog => dialog.subscribe(elementModified => {
              if (elementModified) {
                elemento = elementModified;
                this.enviaNotificacion({ accion, elemento });
              }
            }));
          } else {
            const form = new Formulario(TF.EDICION, this.modelo, this.visual, 'Edición del elemento');
            form.elemento = elemento;
            this.sharedService.muestraFormulario(form).subscribe(dialog => dialog.subscribe(resp => {
              if (resp) {
                if (this.clavePrimaria) {
                  if (!this.sharedService.findRepeat(this.datos.slice().concat([resp]), this.clavePrimaria)) {
                    this.enviaNotificacion({ accion, elemento });
                  }
                } else {
                  this.enviaNotificacion({ accion, elemento });
                }
              }
            }));
          }
          break;
        case 'subir':
        case 'bajar':
          // TODO: Implementar gestion de acciones subir y bajar
          this.enviaNotificacion({ accion, elemento })
          break;
      }
    }
  }



  /**
   * Realiza insercciones a elementos hijos
   *
   * @param raiz Elemento padre
   * @param elementoNuevo Elemento a añadir
   */
  addNuevoElementoHijo(raiz: any, elementoNuevo: any): void {
    const pos = this.datos.indexOf(raiz);
    if (pos !== -1) {
      this.datos[pos][this.nextTabla] ? this.datos[pos][this.nextTabla].push(elementoNuevo) : [elementoNuevo];
      this.refrescaTablasHijas();
    }
    else {
      if (this.tablaInfinitaHija) this.tablaInfinitaHija.addNuevoElementoHijo(raiz, elementoNuevo);
    }
  }

  /**
   * Lógica de selección de un elemento
   *
   * @param elemento Elemento a seleccionar
   * @param forzado Si está a true, fuerza la ejecución de la lógica de selección aunque ya estuviera
   */
  seleccion(elemento: any, forzado?: boolean): void {
    if (this.seleccionable) {
        this.elementoSeleccionado = this.elementoSeleccionado === elemento ? null : elemento;
        this.childrenLoaded.subscribe(() => {
          this.enviaNotificacion({ accion: 'configurar', elemento: this.elementoSeleccionado });
        })
      
    }
  }


  /**
   * Prepara el envío de datos al componente que haya invocado la tabla
   *
   * @param event Información a enviar
   * @param nivel Si procede de una tabla hija
   */
  enviaNotificacion(event: { accion: string; elemento: any }, nivel?: string, isExpansion?: boolean): void {
    const envio: object = Object.assign({}, event);
    envio['raiz'] = nivel ? this.elementoSeleccionado : event.elemento;
    if (nivel) envio[nivel] = event.elemento;
    if (isExpansion) envio[nivel] = event['raiz'];
    delete envio['elemento'];
    this.notify.emit(envio);
  }

  /**
   * Prepara el envío de datos a la tabla hija
   *
   * @param event Información a enviar
   * @param nivel nivel de anidación
   * @param isExpansion Si es expansión
   */
  notifyTablaHija(event: { accion: string; elemento: any }, nivel: string, isExpansion: boolean): void {
    this.enviaNotificacion(event, nivel, isExpansion);
  }



}