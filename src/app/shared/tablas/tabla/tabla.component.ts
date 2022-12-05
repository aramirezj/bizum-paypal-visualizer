import { Component } from '@angular/core';
import { Formulario, TF } from '../../modelos/Formulario';
import { SharedService } from '../../shared.service';

import { TablaMaestra } from '../TablaMaestra';

/** Componente de la Tabla encargada del listado y tratado de elementos */
@Component({
  selector: 'arja-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss']
})
export class TablaComponent extends TablaMaestra{
  constructor(
    public override sharedService: SharedService
  ) {
    super(sharedService);
  }

  ngOnInit(): void {
    this.preparaTabla();
  }

  ngAfterViewInit(): void {
    if (this.elementoPreseleccionado) this.seleccion(this.elementoPreseleccionado);
    if (this.subjectLoaded) this.subjectLoaded.next(this);
  }

  /** Preparación inicial de herramientas necesarias para la tabla */
  preparaTabla(): void {
    this.datos = this.datos ? this.datos : [];
    this.datosAMostrar = this.datos.slice();
    this.accionesParsed = this.accionesCondicionales ? this.accionesCondicionales : this.sharedService.parseAcciones(this.acciones);
    const index = this.accionesParsed.findIndex(accion => accion.funcion === 'configurar');
    if (index !== -1) {
      this.seleccionable = true;
      this.accionesParsed.splice(index, 1);
    }
    this.pageEvent.length = this.datosAMostrar?.length;
    this.pageEvent.pageIndex = 0;
    if (!this.paginador) this.pageEvent.pageSize = 99999;

    if (this.paginacionAsincrona) {
      this.pageEvent.length = this.paginacionAsincrona.paginacion.numeroRegistrosTotal;
    } else {
      this.paginacion(this.pageEvent);
    }
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
  }
  /**
   * Evento de notificación de cuando se ha realizado una acción
   *
   * @param elemento Elemento sobre el cual se va a realizar la acción
   * @param accion Acción a realizar y devolver
   */
  doAccion(elemento: any, accion: string): void {
    if (!this.accionesAutoGestionadas.includes(accion)) {
      this.notify.emit({ accion, elemento });
    } else {
      switch (accion) {
        case 'eliminarT':
          this.sharedService.muestraConfirmacion('eliminarGenerico2', elemento, this.modelo[0], this.visual[0]).subscribe(accept => {
            if (accept) {
              this.datos.splice(this.datos.indexOf(elemento), 1);
              this.datosAMostrar.splice(this.datosAMostrar.indexOf(elemento), 1);
              this.notify.emit({ accion, elemento });
            }
          });
          break;
        case 'eliminar':
          this.sharedService.muestraConfirmacion('eliminarGenerico2', elemento, this.modelo[0], this.visual[0]).subscribe(accept => {
            if (accept) {
              this.notify.emit({ accion, elemento });
            }
          });
          break;
        case 'editarT':
          if (this.formulario) {
            this.formulario.elemento = elemento;
            this.sharedService.muestraFormulario(this.formulario).subscribe(dialog => dialog.subscribe(elementModified => {
              if (elementModified) {
                elemento = elementModified;
                this.notify.emit({ accion, elemento });
              }
            }));
          } else {
            const form = new Formulario(TF.EDICION, this.modelo, this.visual, 'Edición del elemento');
            form.elemento = elemento;
            this.sharedService.muestraFormulario(form).subscribe(dialog => dialog.subscribe(resp => {
              if (resp) {
                if (this.clavePrimaria) {
                  if (!this.sharedService.findRepeat(this.datos.slice().concat([resp]), this.clavePrimaria)) {
                    this.notify.emit({ accion, elemento });
                  }
                } else {
                  this.notify.emit({ accion, elemento });
                }
              }
            }));
          }
          break;
      }
    }
  }



  /**
   * Lógica de selección de un elemento
   *
   * @param elemento Elemento a seleccionar
   * @param atributo Por el que filtrar
   */
  seleccion(elemento: any, atributo?: string): void {
    if (this.seleccionable) {
      if (atributo) {
        const elementoEncontrado: any = this.datosAMostrar.find(dato => dato[atributo] === elemento[atributo]);
        this.elementoSeleccionado = elementoEncontrado;
      } else {
        this.elementoSeleccionado = this.elementoSeleccionado === elemento ? null : elemento;
      }
      this.notify.emit({ accion: 'configurar', elemento: this.elementoSeleccionado });
    }
  }

}