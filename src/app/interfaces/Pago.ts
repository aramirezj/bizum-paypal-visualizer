export class Pago {
    cantidad: number;
    fecha: Date;
    remitente: string;
    concepto: string;
    static regDinero: RegExp = new RegExp(/(?<= de )(.*)(?= EUR )/, 'g');
    static regRemitente: RegExp = new RegExp(/(?<= EUR de )(.*)(?= por )/, 'g');
    static regConcepto: RegExp = new RegExp(/(?<=por).*/, 'g');
    static pagosValidos:string[] = ['Pago general','Pago mediante móvil'];
    constructor() {



    }


    static PagoBizum(mensaje: string, epoch: number): Pago {
        if (mensaje.includes('recibido')) {
            const pago: Pago = new Pago();
            pago.cantidad = parseInt(mensaje.match(Pago.regDinero)[0].trim());
            pago.remitente = mensaje.match(Pago.regRemitente)[0].trim();
            pago.concepto = mensaje.match(Pago.regConcepto)[0].trim();
            pago.fecha = new Date(0);
            pago.fecha.setUTCMilliseconds(epoch);
            return pago;
        }

    }

    static PagoPaypal(datos: any[]): Pago {
        if(parseInt(datos[7])>0 && Pago.pagosValidos.includes(datos[4])){
            const pago: Pago = new Pago();
            pago.cantidad = parseInt(datos[7]);
            pago.remitente = datos[3]
            pago.concepto = '';
            pago.fecha = pago.formateaFecha(datos[0]);



            return pago;
        }

    }

    formateaFecha(fechaStr:string){
        const partes = fechaStr.split('/');
        const fecha = new Date();
        fecha.setFullYear(parseInt(partes[2]));
        fecha.setMonth((parseInt(partes[1])-1));
        fecha.setDate(parseInt(partes[0]));
        return fecha;
    }




}