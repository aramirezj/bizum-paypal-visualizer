import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FiltroAvanzado } from '../../modelos/FiltroAvanzado';

/** Componente encargado de mostrar un formulario de busqueda */
@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss']
})
export class BuscadorComponent implements OnInit {
  /** Instancia del filtro avanzado en caso de llevar */
  @Input() filtroAvanzado: FiltroAvanzado;
  /** Elemento para notificar al componente que invoca la tabla */
  @Output() notify: EventEmitter<any> = new EventEmitter<{ tipo: string, resultado: any }>();
  /** Formulario para el buscador simple */
  form: FormGroup;
  /** Booleano para controlar el mostrado del buscador avanzado */
  muestraAvanzado: boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      busqueda: new FormControl()
    });
  }

  /**
 * Envio de la busqueda
 * @param valor Valor sobre el que filtrar
 */
  busqueda(valor: string): void {
    if (valor) valor = valor.toLowerCase();
    this.notify.emit({ tipo: 'simple', resultado: valor });
  }
  /** Envío de la busqueda en caso de usar buscador avanzado */
  busquedaAvanzada(): void {
   // const busquedaAsociada: BusquedaAvanzadaObj[] = [];
   const busquedaAsociada: any[] = [];
    this.filtroAvanzado.campos.forEach(campo => busquedaAsociada.push({ clave: campo.modelo, valor: this.filtroAvanzado.form.get(campo.modelo).value }));
    // TODO cuando te to ready this.notify.emit({ tipo: 'avanzado', resultado: busquedaAsociada });
  }

}