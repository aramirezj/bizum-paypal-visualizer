import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Accion } from '../../modelos/Accion';
import { AccionCondicion } from '../../modelos/AccionCondicion';


/** Componente encargado de la lógica de acciones con condiciones */
@Component({
  selector: 'app-accion-tabla',
  templateUrl: './accion-tabla.component.html',
  styleUrls: ['./accion-tabla.component.scss']
})

export class AccionTablaComponent implements OnInit {
  /** Acción con la que se trabaja */
  @Input() accion: Accion;
  /** Elemento sobre el que se evalua */
  @Input() elemento: any;
  /** Evento de notificación de la acción */
  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();
  /** Para saber si está deshabilitado o no */
  disabled = false;
  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.checkConditions();
    if (this.accion.observerCondiciones) {
      this.accion.observerCondiciones.subscribe(() => this.checkConditions());
    } else {
      this.disabled = this.accion.disabled;
    }
  }
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }
  /** Envía la notificación */
  doAccion() {
    this.clicked.emit({});
  }


  /** Comprueba todas las condiciones */
  checkConditions() {
    let resultado: boolean = false;
    let tieneSustituta: AccionCondicion;
    let resultadoSustituta: boolean = false;
    if (this.accion.condiciones) {
      for (const condicion of this.accion.condiciones) {
        tieneSustituta = condicion.accionSustituta != null ? condicion : tieneSustituta;
        let resultadoPropio: boolean = this.compruebaCondicion(condicion);
        resultado = resultadoPropio ?? resultado;
        resultadoSustituta = condicion.accionSustituta ? resultadoPropio : resultadoSustituta;
      }
    }
    if (!resultadoSustituta) {
      this.disabled = resultado;
      this.accion.disabled = resultado;
    } else if (tieneSustituta && resultadoSustituta) {
      const nuevaSustituta = Object.assign({}, this.accion);
      this.accion = tieneSustituta.accionSustituta;
      this.accion.condiciones = nuevaSustituta.condiciones;
      this.disabled = tieneSustituta.deshabilitaSustituta;
      this.accion.disabled = tieneSustituta.deshabilitaSustituta;
    }
  }
  
  /**
   * Lógica para comprobar una condición
   * @param condicion Condición a comprobar
   * @returns Si la comprobación ha sido satisfactoria
   */
  compruebaCondicion(condicion: AccionCondicion): boolean {
    let resultado: boolean = false;
    switch (condicion.tipoCondicion) {
      case 'boolean':
        switch (condicion.logica) {
          case 'required':
            resultado = this.elemento[condicion.atributo] ? true : false;
            break;
          case 'missing':
            resultado = this.elemento[condicion.atributo] ? false : true;
            break;
        }
        break;
      case 'equal':
        resultado = this.elemento[condicion.atributo] === condicion.logica ? true : false;
        break;
      case 'different':
        resultado = this.elemento[condicion.atributo] !== condicion.logica ? true : false;
        break;
    }
    return resultado;
  }


}
