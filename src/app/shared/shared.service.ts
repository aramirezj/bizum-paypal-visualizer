import { Injectable } from '@angular/core';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ConfirmacionComponent } from './formularios/confirmacion/confirmacion.component';
import { EditarGenericoComponent } from './formularios/editar-generico/editar-generico.component';
import { Accion } from './modelos/Accion';
import { Formulario, TF } from './modelos/Formulario';

/** Servicio de utilidades para la aplicación */
@Injectable()
export class SharedService {
    /** Mensajes posibles para dialogos de confirmación */
    mensajes: object = {
        eliminarGenerico: '¿Está seguro de que desea eliminar este elemento?',
        eliminarGenerico2: '¿Está seguro de que desea eliminar el elemento con ?? : \??\?',
        guardarGenerico: '¿Está seguro de guardar el elemento'
    };
    constructor(
        private dialog: MatDialog,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
    }
    /**
     * Función que convierte las acciones al modelado para obtener sus atributos
     *
     * @param acciones
     * @returns Listado de acciones
     */
    parseAcciones(acciones: string[]): Accion[] {
        if (acciones) {
            const parsedAcciones: Accion[] = [];
            for (const accion of acciones) {
                const accionParsed = new Accion(accion);
                parsedAcciones.push(accionParsed);
            }
            return parsedAcciones;
        } else {
            return [];
        }
    }

    /**
     * Función que abre un EditarGenerico a traves de un formulario
     *
     * @param form Formulario a mostrar
     * @param size VW del dialogo
     * @returns Observable del dialogo
     */
    muestraFormulario(form: Formulario, size?: string): Observable<any> {
        return this.openGenericDialog(EditarGenericoComponent, form, size ? size : '45vw', null, null, true);
    }
    /**
     * Muestra un formulario generico para la creación de un elemento
     *
     * @param columnasModelo Atributos del objeto
     * @param columnasVisuales Nombres visuales del objeto
     * @returns Observable del dialogo
     */
    creacionGenerica(columnasModelo: string[], columnasVisuales: string[]): Observable<any> {
        const form = new Formulario(TF.CREACION, columnasModelo, columnasVisuales, 'Creación del elemento');
        return new Observable(observer => {
            this.muestraFormulario(form).subscribe(dialog => dialog.subscribe(resp => {
                observer.next(resp);
                observer.complete();
            }))
        })
    }

    /**
     * Función que gestiona la apertura de un dialogo de confirmación
     *
     * @param tipo El identificador del catálogo de mensajes, si no lo encuentra, el tipo actua de mensajes
     * @param elemento Elemento del que se pide confirmación
     * @param atributo Atributo del que se cogerá el identificador en caso de ser necesario
     * @param visual Texto a mostrar para el atributo
     * @returns Observable del dialogo
     */
    muestraConfirmacion(tipo: string, elemento?: any, atributo?: string, visual?: string): Observable<any> {
        const dialogRef = this.dialog.open(ConfirmacionComponent, this.openDialog(30));
        let mensaje = elemento ? this.mensajes[tipo].replace('??', visual).replace('??', elemento[atributo]) : this.mensajes[tipo];
        mensaje = mensaje ? mensaje : tipo;
        dialogRef.componentInstance.mensaje = mensaje;
        return dialogRef.afterClosed();
    }


    /**
     * Función que devuelve la configuración de un dialogo
     *
     * @param size Parametro opcional para determinar el tamaño del dialogo
     * @returns Configuración del dialogo
     */
    openDialog(size?: number): MatDialogConfig {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.width = size ? size + 'vw' : '30vw';
        dialogConfig.height = 'auto';
        dialogConfig.maxWidth = size ? size + 'vw' : '30vw';
        dialogConfig.autoFocus = true;
        return dialogConfig;
    }
    /**
     * Apertura de un dialogo para un componente a recibir
     *
     * @param component Componente a invocar
     * @param data Datos a transmitir al componente
     * @param size Ancho de la ventana emergente
     * @param height Altura de la ventana emergente
     * @param directInject Si debe injectar atributos en el componente
     * @param disableClose Si debe deshabilitar el cierre clicando fuera
     */
    openGenericDialog(component: any, data: any, size?: string, height?: string, directInject?: any[], disableClose?: boolean): Observable<any> {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = false;
        dialogConfig.data = data;
        dialogConfig.width = size ? size : 'fit-content';
        dialogConfig.maxWidth = size ? size : 'fit-content';
        dialogConfig.height = height ? height : null;
        dialogConfig.maxHeight = height ? height : null;
        dialogConfig.disableClose = disableClose ? disableClose : false;
        const dialogRef = this.dialog.open(component, dialogConfig);
        if (directInject) {
            directInject.forEach(direct => dialogRef.componentInstance[direct.name] = direct.value)
        }
        return new Observable(observer => {
            observer.next(dialogRef.afterClosed());
            observer.complete();
        });
    }
    /**
     * Apertura de un dialogo para un componente a recibir. Devuelve una referencia al dialogo
     *
     * @param component Componente a invocar
     * @param data Datos a transmitir al componente
     * @param size Ancho de la ventana emergente
     * @param height Altura de la ventana emergente
     * @param directInject Si debe injectar atributos en el componente
     * @param disableClose Si debe deshabilitar el cierre clicando fuera
     */
    getGenericDialogWithRef(component: any, data: any, size?: string, height?: string, directInject?: any[], disableClose?: boolean): MatDialogRef<any, any> {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = false;
        dialogConfig.data = data;
        dialogConfig.width = size ? size : 'fit-content';
        dialogConfig.maxWidth = size ? size : 'fit-content';
        dialogConfig.height = height ? height : null;
        dialogConfig.maxHeight = height ? height : null;
        dialogConfig.disableClose = disableClose ? disableClose : false;
        const dialogRef = this.dialog.open(component, dialogConfig);
        if (directInject) {
            directInject.forEach(direct => dialogRef.componentInstance[direct.name] = direct.value)
        }
        return dialogRef;
    }

    /**
     * Función que busca campos que tengan cierto atributo repetido
     *
     * @param datos Coleccion de datos
     * @param clavePrimaria Nombre del atributo
     * @returns Si está repetido
     */
    findRepeat(datos: any[], clavePrimaria: string): boolean {
        let repetido = false;
        for (const dato of datos) {
            if (!repetido) {
                if (datos.filter(datoF => datoF[clavePrimaria] === dato[clavePrimaria]).length > 1) {
                    repetido = true;
                }
            }
        }
        if (repetido) { this.openSnackBar('No se ha podido añadir el elemento, su clave está repetida', 3); }
        return repetido;
    }
    /**
     * Función que devuelve una colección con los nombres de los campos que tengan error
     *
     * @param formToInvestigate Formulario a procesar
     * @param scroll Si debe hacer scroll hasta el elemento
     */
    findInvalidControlsRecursive(formToInvestigate: FormGroup | FormArray): string[] {
        const invalidControls: string[] = [];
        const recursiveFunc = (form: FormGroup | FormArray) => {
            Object.keys(form.controls).forEach(field => {
                const control = form.get(field);
                if (control.invalid) { invalidControls.push(field); }
                if (control instanceof FormGroup) {
                    recursiveFunc(control);
                } else if (control instanceof FormArray) {
                    recursiveFunc(control);
                }
            });
        };
        recursiveFunc(formToInvestigate);

        return invalidControls;
    }
    /**
     * Función para averiguar si de verdad de la buena, un elemento es un número
     *
     * @param valor Valor a evaluar
     * @returns Si es númerico
     */
    isNumber(valor: any): boolean {
        return !isNaN(valor) && valor !== true && valor !== false && typeof valor !== 'object';
    }

    /**
     * Preparo un objecto con los formatos y en ellos declaro los atributos que lo utilizan.
     *
     * @param f FormatosRaw
     * @returns Objeto con los formatos
     */
    setFormatos(f: any): object {
        const fReady: object = {};

        f.numero = !f.numero ? [] : f.numero;
        f.euro = !f.euro ? [] : f.euro;
        f.porcentaje = !f.porcentaje ? [] : f.porcentaje;
        f.texto = !f.texto ? [] : f.texto;
        f.date = !f.date ? [] : f.date;

        f.numero.forEach(atributo => fReady[atributo] = 'numero');
        f.euro.forEach(atributo => fReady[atributo] = 'euro');
        f.porcentaje.forEach(atributo => fReady[atributo] = 'porcentaje');
        f.texto.forEach(atributo => fReady[atributo] = 'texto');
        f.date.forEach(atributo => fReady[atributo] = 'date');

        return fReady;
    }

    /**
     * Función que transforma el objecto con el tamaño en caracteres de los campos en el formato interno de las tablas
     *
     * @param c CaracteresRaw
     * @returns Objeto con los tamaños por caracter
     */
    setCaracteres(c: any[]): object {
        const cReady = {};
        for (const caracter of c) {
            cReady[caracter.nombreModelo] = caracter.caracteres;
        }
        return cReady;
    }

    /**
     * Función que llamaran las tablas para mostrar una notificación correspondiente a la operación
     * que se haya realizado
     *
     * @param sizePrevia Longitud previa de la tabla
     * @param sizeNueva Longitud nueva de la tabla
     * @param editar Booleano opcional para indicar si el mensaje es de una modificación
     */
    gestionaNotificaciones(sizePrevia: number, sizeNueva: number, editar?: boolean): void {
        let message = '';
        message = sizePrevia < sizeNueva ? 'Se ha añadido un elemento' : 'Se ha eliminado un elemento';
        message = editar ? 'Se ha modificado el elemento correctamente' : message;
        this.openSnackBar(message, 4);
    }

    /**
     * Función encargada de realizar las conversiones de las fechas
     *
     * @param date fecha a la que dar formato
     * @param locale parametro utilizado para decidir si se formatea al formato español o al requerido por el back
     */
    dateFormat(date: any, locale?: string): string {
        return locale === 'es' ? formatDate(date, 'dd/MM/yyyy', 'es-es') : formatDate(date, 'yyyy/MM/dd', 'es-es');
    }

    /**
     * Función encargada de realizar las conversiones de las fechas solo para el back
     *
     * @param date fecha a la que dar formato
     * @returns La fecha formateada
     */
    dateFormatBackend(date: any): string {
        return formatDate(date, 'yyyy-MM-dd', 'es-es');
    }

    /**
     * Función encargada de realizar las conversiones de las fechas
     *
     * @param date fecha a la que dar formato
     * @param locale parametro utilizado para decidir si se formatea al formato español o al requerido por el back
     * @returns La fecha formateada
     */
    dateTimeFormat(date: any, locale?: string): string {
        return locale === 'es' ? formatDate(date, 'dd/MM/yyyy HH:mm', 'es-es') : formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSS', 'es-es');
    }
    /**
     * Comprueba si dos arrays son exactamente iguales
     *
     * @param a Primer array
     * @param b Segundo array
     * @returns Si son iguales o no
     */
    arrayEquals(a: any[], b: any[]): boolean {
        if (!a && !b || !a && !b.length || !a.length && !b) return true; else {
            return Array.isArray(a) &&
                Array.isArray(b) &&
                a.length === b.length &&
                a.every((val, index) => val === b[index]);
        }

    }
    /**
     * Realiza una redirección guiada
     *
     * @param ruta Ruta a redirigir, podrá ser un objeto
     * @param segundos Segundos que deberá tardar en redirigir
     */
    redireccionTimed(ruta: any, segundos: number): void {
        setTimeout(() => {
            this.router.navigate(ruta)
        }, segundos * 1000);
    }
    /**
     * Compara dos fechas, devuelve true si la primera fecha es ANTES que la segunda
     *
     * @param fecha1 Primera fecha
     * @param fecha2 Segunda fecha
     * @returns Resultado de la comparación
     */
    comparaFechas(fecha1: any, fecha2: any): boolean {
        return fecha1 && fecha2 ? new Date(fecha1) < new Date(fecha2) : true;
    }

    /**
     * Función que prepara la creación de notificaciones
     *
     * @param message Mensaje a mostrar
     * @param seconds Segundos que debe durar la notificación
     */
    openSnackBar(message: string, seconds: number): void {
        const snackBarConfig: MatSnackBarConfig = new MatSnackBarConfig();

        snackBarConfig.duration = seconds * 1000;
        snackBarConfig.horizontalPosition = 'center';
        snackBarConfig.verticalPosition = 'bottom';
        snackBarConfig.panelClass = 'customSnackbar';

        this.snackBar.open(message, 'Cerrar', snackBarConfig);
    }
}
