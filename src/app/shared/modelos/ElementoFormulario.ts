
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { TC, TC_F } from './Formulario';
/** Clase utilizada por la clase Formulario para tener una lista de controles y gestionarlos */
export class ElementoFormulario {
  /** FormControl que tendrá vinculado el elemento */
  control: FormControl;
  /** Formato número que podrá tener */
  formatoNumero: object = { suffix: '' };
  /** Flex que podrá tener asociado para establecer un tamaño al campo, si no lo tiene, coge el por defecto del formulario */
  fxFlex: number = null;
  /** Si debe convertirse a mayusculas o minusculas */
  subFormato: TC_F;
  /** Lista de configuraciones default que puede llevar, actualmente solo TV */
  preset: string;
  constructor(
    public nombre: string,
    public tipo?: TC | string,
    public disabled?: boolean,
    public listado?: Observable<any> | any[],
    public label?: string,
    public value?: string,
    public secondLabel?: string,
    public multiple?: boolean,
    public key?:string
  ) {
    this.tipo = this.tipo ?? TC.TEXTO;
    this.control = new FormControl({ value: null, disabled: this.disabled });
    //Si no tiene label asumimos que es un TV
    this.label = this.label ? this.label : 'valDesCom';
    //Si el value es ALL significa que deberá enviar el objeto entero
    this.value = this.value ? this.value === 'all' ? null : this.value : this.value;
    this.multiple = multiple === true;
    //Asignación del PRESET
    if ((this.label === 'valDesCom'|| this.label === 'valDesAbr') && !this.value) this.preset = 'TV';
  }
  /**
   * Función que fija el tipo de formato númerico para mostrar
   *
   * @param tipo Tipo a elegir
   * @param mask Objeto con un formato personalizado
   */
  setFormatoNumero(tipo: TC_F | string, mask?: object): void {
    switch (tipo) {
      case 'euro':
        this.formatoNumero = { suffix: '€', decimal: ',', precision: 2 };
        break;
      case 'porcentaje':
        this.formatoNumero = { suffix: '%', decimal: ',', precision: 2 };
        break;
      case 'orden':
        this.formatoNumero = { suffix: 'º' };
        break;
      default:
        this.formatoNumero = { thousands: '' };
        break;
    }
    this.tipo = TC.NUMERO;
    if (mask) {
      Object.entries(mask).forEach(([clave, valor]) => {
        this.formatoNumero[clave] = valor;
      });
    }
  }
}
