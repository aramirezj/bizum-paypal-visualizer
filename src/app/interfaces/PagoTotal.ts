import { Pago } from "./Pago";

export interface PagoTotal {
    pagos: Pago[],
    total: number
}