import { Component, Input, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.scss']
})
export class GraficosComponent {
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  grafico: { name: string, value: number }[] = [];
  @Input() pagosPersonas: { veces: number, cantidad: number, nombre: string }[] = [];


  ngOnInit() {
    this.preparaGrafico();
  }

  ngOnChanges(changes:{pagosPersonas:SimpleChange}){
    if(!changes.pagosPersonas.firstChange){
      this.preparaGrafico();
    }
  }

  preparaGrafico() {
    this.grafico = [];
    const nombres = Object.keys(this.pagosPersonas);
    nombres.sort();
    for (const persona of nombres) {
      this.grafico.push({
        name: persona,
        value: this.pagosPersonas[persona].cantidad
      })
    }
  }
}
