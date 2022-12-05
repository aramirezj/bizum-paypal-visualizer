import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { FormatosTabla } from '../../modelos/FormatosTabla';

/** Equivale a un TD de una tabla, se encarga de mostrarlo con cierta lógica */
@Component({
  selector: 'app-elemento-tabla',
  templateUrl: './elemento-tabla.component.html',
  styleUrls: ['./elemento-tabla.component.scss']
})
export class ElementoTablaComponent implements OnInit {
  /** Elemento a tratar */
  @Input() campo: any;
  /** Elemento a tratar */
  @Input() elemento: any;
  /** Formato del campo */
  @Input() formato: string;
  /** Número de caracteres máximos que podrá mostrar el campo. Si se supera se muestra un tooltip */
  @Input() numCaracteres: number = null;
  /** Formato a asignar */
  @Input() formatoTabla: FormatosTabla;
  /** Nombre del atributo del que se parte */
  @Input() atributo: string

  constructor() { }

  ngOnInit(): void {
    const splitted: string[] = this.atributo.split('.');
    this.campo = splitted.length == 1 ? this.campo : this.elemento[splitted[0]][splitted[1]];
    if (this.formatoTabla) {
      this.formato = this.formatoTabla.getFormato(this.atributo);
    }
    this.prepararElemento();
  }

  ngOnChanges(change: SimpleChange) {
    if (!change.firstChange) this.prepararElemento();
  }
  /**
   * Asignación del formato necesario según el contenido del elemento
   *
   * @param forzar Si se ha modificado el campo, se fuerza otra comprobación
   */
  prepararElemento(): void {
    if (this.campo || this.campo === false || this.campo === 'false') {
      this.numCaracteres = this.numCaracteres ? this.numCaracteres : 150;
      if (!this.formato) {
        if (this.campo === 'true' || this.campo === true) {
          this.formato = 'boolean';
        } else if (this.campo === 'false' || this.campo === false) {
          this.formato = 'boolean';
        } else if (/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/.test(this.campo)) {
          this.formato = 'texto';
        } else if (this.campo instanceof Date && this.campo as unknown as string != 'Invalid Date') {
          this.formato = 'date';
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(this.campo)) {
          this.formato = 'date';
        } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:(?:\+\d{2}:\d{2})|Z)$/.test(this.campo)) {
          this.formato = 'dateTime';
        } else if (this.campo.length > this.numCaracteres) {
          this.formato = 'texto';
        }
      }
    }
  }
}