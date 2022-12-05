import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxCsvParser } from 'ngx-csv-parser';
import { forkJoin, Observable } from 'rxjs';
import { Parser, parseString } from 'xml2js';
import { Pago } from './interfaces/Pago';
import { PagoTotal } from './interfaces/PagoTotal';
import { FileService } from './services/file.service';
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
      personasBloqueadas: new FormControl(this.personasBloqueadas)
    });

    this.formularioRestriccion.get('personasBloqueadas').valueChanges.subscribe(listado => {
      this.personasBloqueadas = listado;
      localStorage.setItem('personasBloqueadas', JSON.stringify(this.personasBloqueadas));
      this.generaEstadisticas();
    })

  }

  /*generaPagos() {

    this.headersPeticion = {
      headers: new HttpHeaders()
        .append('Access-Control-Allow-Methods', 'GET').append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"), responseType: 'text'
    }
    const peticionSMS: Observable<any> = this.http.get('assets/sms.xml', this.headersPeticion);
    const peticionPaypalNuevo: Observable<any> = this.http.get('assets/arj.csv', this.headersPeticion);
    const peticionPaypalViejo: Observable<any> = this.http.get('assets/paypalAntiguo.csv', this.headersPeticion);
    forkJoin({
      sms: peticionSMS,
      paypalNuevo: peticionPaypalNuevo,
      paypalViejo: peticionPaypalViejo
    }).subscribe(ficheros => {
      this.paypals = [];
      this.bizums = this.fileService.parseaXML([ficheros.sms]);


      this.paypals.push(...this.fileService.parseaCSV([ficheros.paypalViejo]));
      this.paypals.push(...this.fileService.parseaCSV([ficheros.paypalNuevo]));



      this.generaEstadisticas();
      this.pagosListos = true;


    })


  }*/

  obtieneBizums(bizums: Pago[]) {
    if (bizums.length) {
      this.pagosListos = false;
      let total: number = 0;
      bizums.forEach(bizum => total += bizum.cantidad);
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
      let total: number = 0;
      paypals.forEach(paypal => total += paypal.cantidad);
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
    console.log(this.tPaypals)
    if(this.tBizums) this.tBizums.refrescaTabla(this.bizumsFiltrados?.pagos);
    if(this.tPaypals) this.tPaypals.refrescaTabla(this.paypalsFiltrados?.pagos);
    this.pagosListos = true;

  }






  filtraPersonas(pagos: Pago[]): PagoTotal {
    let total: number = 0;
    pagos.forEach(pago => { if (!this.personas.includes(pago.remitente)) this.personas.push(pago.remitente) });
    const pagosFiltrados: Pago[] = pagos.filter(pago => !this.personasBloqueadas.includes(pago.remitente));
    pagosFiltrados.forEach(pago => {
      total += pago.cantidad;
      this.addPagoPersona(pago);
    });
    return { pagos: pagosFiltrados, total };

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
