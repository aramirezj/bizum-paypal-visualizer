import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxCsvParser } from 'ngx-csv-parser';
import { Parser } from 'xml2js';
import { Pago } from '../interfaces/Pago';
/** Servicio de ficheros */
@Injectable({
    providedIn: 'root'
})
export class FileService {
    /** Formato paypal */
    paypalFormat: string = 'csv'
    /** Formato bizum */
    smsFormat: string = 'xml';
    //Parser de xml
    xmlParser = new Parser({ trim: true, explicitArray: true });

    bizums: Pago[];

    paypals: Pago[];
    constructor(
        public snackBar: MatSnackBar,
        private ngxCsvParser: NgxCsvParser
    ) {


    }



    paypalsValidos(cvs: File[]) {
        let correctos: boolean = true;
        for (const file of cvs) {
            if (this.getFormatOfFile(file) !== this.paypalFormat) {
                correctos = false;
                break;
            }
        }
        return correctos;
    }

    bizumsValidos(bizums: File[]) {
        let correctos: boolean = true;
        for (const file of bizums) {
            if (this.getFormatOfFile(file) !== this.smsFormat) {
                correctos = false;
                break;
            }
        }
        return correctos;
    }

    parseaXML(textosXML: string[]): Pago[] {
        this.bizums = [];
        for (const textoXML of textosXML) {
            this.xmlParser.parseString(textoXML, this.parseStringXml.bind(this));
        }

        return this.bizums.slice();

    }

    parseaCSV(textosCSV: string[]): Pago[] {
        this.paypals = [];

        for (const textoCSV of textosCSV) {
            this.parseStringCsv(this.ngxCsvParser.csvStringToArray(textoCSV, ','))
        }

        return this.paypals.slice();


    }

    /**
    * Formatea los XML de los sms generando bizums
    * @param error 
    * @param result 
    */
    private parseStringXml(error: Error, result: any): void {
        const smses: any[] = result.smses.sms;
        const bizums: Pago[] = [];
        let totalDinero: number = 0;
        for (const sms of smses) {
            const mensaje: string = sms.$.body;
            const bizum: Pago = Pago.PagoBizum(mensaje, sms.$.date);
            if (bizum) {
                bizums.push(bizum);
                totalDinero += bizum.cantidad;
            }

        }
        this.bizums.push(...bizums);
    }

    private parseStringCsv(transferencias: any[][]) {
        transferencias.shift();
        const paypals: Pago[] = [];
        for (const transferencia of transferencias) {

            const pagoPaypal: Pago = Pago.PagoPaypal(transferencia);
            if (pagoPaypal) {
                paypals.push(pagoPaypal);
            }
        }

        this.paypals.push(...paypals);
    }





    /**
     * Hace un nombre aleatorio según una extensión
     * @param extension Extensión del fichero
     * @returns Nombre del fichero completo
     */
    makeRandomName(extension: string): string {
        let name = Math.random().toString(36).substring(2) + "." + extension;
        return name;
    }

    /**
     * Obtiene el formato de un fichero
     * @param file Fichero
     * @returns El formato
     */
    getFormatOfFile(file: File): string {
        if (file.type) return file.type.split('/')[1]?.toLowerCase();

    }


}