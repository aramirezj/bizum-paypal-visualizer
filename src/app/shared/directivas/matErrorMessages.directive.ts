import { Component, AfterViewInit, Injector, Input } from '@angular/core';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

/** Directiva utilizada para mediante el llamado de la etiqueta, autogestionar todos los errores,
 *  pudiendose incluso incluir un patrón como validación */
@Component({
  selector: '[matErrorMessages]',
  template: '{{ error }}'
})
export class MatErrorMessagesDirective implements AfterViewInit {
  /** Patrón customizado para validar */
  @Input() customPattern: string;
  /** Error a mostrar */
  error = '';
  /** Referencia al control en el DOM */
  inputRef: MatFormFieldControl<MatInput>;
  constructor(private _inj: Injector) { }

  ngAfterViewInit() {
    const container = this._inj.get(MatFormField);
    this.inputRef = container._control;

    // Asigno el cambio de estado a la función
    this.inputRef.ngControl.statusChanges.subscribe(this.updateErrors);
    this.updateErrors('INVALID');
  }

  /**
   * Función que controla los errores según cambia el estado
   *
   * @param state
   */
  private updateErrors = (state: 'VALID' | 'INVALID') => {
    if (state === 'INVALID') {
      const controlErrors = this.inputRef.ngControl.errors;
      const firstError = controlErrors ? Object.keys(controlErrors)[0] : null;
      if (firstError === 'required') {
        this.error = 'Este campo es obligatorio.';
      }

      if (firstError === 'minlength') {
        this.error = 'Este campo debe tener al menos ' + controlErrors.minlength.requiredLength + ' caracteres.';
      }

      if (firstError === 'maxlength') {
        this.error = 'Este campo no debe superar los ' + controlErrors.maxlength.requiredLength + ' caracteres.';
      }

      if (firstError === 'min') {
        this.error = 'El valor de este campo debe superar los ' + +controlErrors.min.min.toFixed(2) + '.';
      }

      if (firstError === 'max') {
        if (controlErrors.max === true) {
          this.error = 'El porcentaje no debe superar el 100%.';
        } else {
          this.error = 'El valor de este campo no debe superar los ' + +controlErrors.max.max.toFixed(2) + '.';
        }

      }
      if (firstError === 'email') {
        this.error = 'El correo introducido no es valido, por favor, reviselo.';
      }

      if (firstError === 'pattern') {
        this.error = this.customPattern ? this.customPattern : 'El campo introducido no es correcto.';
      }
      if (firstError === 'existence') {
        this.error = 'El valor de este campo debe existir previamente.'
      }
      if (firstError === 'custom') {
        this.error = controlErrors.custom;
      }
    }
  }
}
