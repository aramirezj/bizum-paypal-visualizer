import { FormGroup } from '@angular/forms';
import { Accion } from './Accion';

/** Clase utilizada para identificar un vagon de un stepper */
export class Vagon {
    public static stepperIJ: string[] = ['datosBasicos', 'datosTramitacion', 'planes', 'formularios', 'baremaciones'];
    public static stepperIJSeguimiento: string[] = ['datosBasicos', 'datosTramitacion', 'formularios', 'baremaciones'];
    public static stepperSolicitud: { nombreModelo: string; nombreAMostrar: string }[] = [{ nombreModelo: 'datosIdentificativos', nombreAMostrar: 'Datos Identificativos' }, { nombreModelo: 'acciones', nombreAMostrar: 'Acciones Formativas' }, { nombreModelo: 'declaraciones', nombreAMostrar: 'Declaraciones/Autorizaciones' }, { nombreModelo: 'documentacion', nombreAMostrar: 'Documentación' }];
    /** Nombre del vagon */
    nombreAMostrar?: string;
    /** Nombre identificativo del vagon */
    nombreModelo?: string;
    /** Si debe mostrarse el vagon o no */
    deshabilitado?: boolean;
    /** El formulario que tiene asociado */
    formulario?: FormGroup;
    /** Acciones disponibles, si está, la botonera mostrará estas acciones, si no, las de base */
    accionesDisponibles?: Accion[];
    constructor(
        public option?: string,
        public orden?: number,
    ) {
        switch (option) {
            case 'datosBasicos':
                this.nombreAMostrar = 'Datos Básicos';
                this.orden = this.orden ? this.orden : 0;
                break;
            case 'datosTramitacion':
                this.nombreAMostrar = 'Datos de la Tramitación';
                this.orden = this.orden ? this.orden : 1;
                break;
            case 'planes':
                this.nombreAMostrar = 'Planes';
                this.accionesDisponibles = [new Accion('volver'), new Accion('continuar'), new Accion('cancelar')];
                this.orden = this.orden ? this.orden : 2;
                break;
            case 'formularios':
                this.nombreAMostrar = 'Configuración de los Formularios';
                this.accionesDisponibles = [new Accion('volver'), new Accion('continuar'), new Accion('cancelar')];
                this.orden = this.orden ? this.orden : 3;
                break;
            case 'baremaciones':
                this.nombreAMostrar = 'Baremaciones y Presupuestos';
                this.accionesDisponibles = [new Accion('volver'), new Accion('cancelar')];
                this.orden = this.orden ? this.orden : 4;
        }
        this.nombreModelo = option;
        this.deshabilitado = false;
        this.formulario = new FormGroup({});
    }

    /**
     * Genera los vagones especificos para una solicitud
     *
     * @returns
     */
    public static generaVagonesSolicitud(ocultos?: string[]): Vagon[] {
        ocultos = ocultos ? ocultos : [];
        const vagonesSolicitud: Vagon[] = [];
        for (let i = 0; i < this.stepperSolicitud.length; i++) {
            if (!ocultos.includes(this.stepperSolicitud[i].nombreModelo)) {
                const vagon: Vagon = {
                    nombreModelo: this.stepperSolicitud[i].nombreModelo,
                    nombreAMostrar: this.stepperSolicitud[i].nombreAMostrar,
                    orden: i
                } as Vagon;
                vagonesSolicitud.push(vagon);
            }

        }
        return vagonesSolicitud;
    }

    /** Deshabilita un vagon */
    deshabilita(): void {
        this.deshabilitado = true;
    }
}
