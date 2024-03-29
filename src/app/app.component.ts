import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Pago } from './interfaces/Pago';
import { PagoTotal } from './interfaces/PagoTotal';
import { TablaComponent } from './shared/tablas/tabla/tabla.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('tBizums',{static:false}) tBizums:TablaComponent;
  @ViewChild('tPaypals',{static:false}) tPaypals:TablaComponent;
  title: string = 'Visualizador Bizums/Paypals'


  headersPeticion: any;

  pagosPersonas: { veces: number, cantidad: number, nombre: string }[] = [];
  personas: string[] = [];
  formularioRestriccion: FormGroup;
  personasBloqueadas: string[] = [];

  bizums: PagoTotal;
  paypals: PagoTotal;

  bizumsFiltrados: PagoTotal;
  paypalsFiltrados: PagoTotal;

  pagosListos: boolean = false;

  fechaFiltro:Date;

  constructor(
  
  ) {
    const cookieP: string = localStorage.getItem('personasBloqueadas');
    if (cookieP) this.personasBloqueadas = JSON.parse(cookieP);

  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {

    this.formularioRestriccion = new FormGroup({
      personasBloqueadas: new FormControl(this.personasBloqueadas),
      fecha: new FormControl()
    });
    this.formularioRestriccion.valueChanges.subscribe(() => {
      console.log(this.formularioRestriccion.value.personasBloqueadas)
      this.personasBloqueadas = this.formularioRestriccion.value.personasBloqueadas;
      this.fechaFiltro = new Date(this.formularioRestriccion.value.fecha);
      localStorage.setItem('personasBloqueadas', JSON.stringify(this.personasBloqueadas));
      this.generaEstadisticas();
    })


  }

  obtieneBizums(bizums: Pago[]) {
    if (bizums.length) {
      this.pagosListos = false;
      const total = bizums.reduce((accumulator, item) => accumulator + item.cantidad, 0);
      this.bizums = {
        total: total,
        pagos: bizums
      };
    } else {
      this.bizums = null;
    }

    this.generaEstadisticas();

  }

  obtienePaypals(paypals: Pago[]) {
    if (paypals.length) {
      this.pagosListos = false;
      const total = paypals.reduce((accumulator, item) => accumulator + item.cantidad, 0);

      this.paypals = {
        total: total,
        pagos: paypals
      };
    } else {
      this.paypals = null;
    }

    this.generaEstadisticas();
  }



  generaEstadisticas() {
    this.personas = [];
    this.pagosPersonas = [];
    this.bizumsFiltrados = null;
    this.paypalsFiltrados = null;
    //Aplicamos filtros
    if (this.bizums?.pagos) this.bizumsFiltrados = this.filtraPersonas(this.bizums.pagos);
    if (this.paypals?.pagos) this.paypalsFiltrados = this.filtraPersonas(this.paypals.pagos);
    if(this.tBizums) this.tBizums.refrescaTabla(this.bizumsFiltrados?.pagos);
    if(this.tPaypals) this.tPaypals.refrescaTabla(this.paypalsFiltrados?.pagos);
    this.pagosListos = true;

  }






  filtraPersonas(pagos: Pago[]): PagoTotal {
    let total: number = 0;
    pagos.forEach(pago => { if (!this.personas.includes(pago.remitente)) this.personas.push(pago.remitente) });
    let pagosPersonasFiltradas: Pago[] = pagos.filter(pago => !this.personasBloqueadas.includes(pago.remitente));
    
    if(this.fechaFiltro){
      const fechaInicio:Date = new Date(this.fechaFiltro)
      pagosPersonasFiltradas = pagos.filter(pago => new Date(pago.fecha)>fechaInicio);
    }
    pagosPersonasFiltradas.forEach(pago => {
      total += pago.cantidad;
      this.addPagoPersona(pago);
    });
    return { pagos: pagosPersonasFiltradas, total };

  }

  addPagoPersona(pago: Pago) {
    if (this.pagosPersonas[pago.remitente]) {
      this.pagosPersonas[pago.remitente].veces++;
      this.pagosPersonas[pago.remitente].cantidad += pago.cantidad;
    } else {
      this.pagosPersonas[pago.remitente] = { veces: 1, cantidad: pago.cantidad, remitente: pago.remitente }
    }
  }





}
