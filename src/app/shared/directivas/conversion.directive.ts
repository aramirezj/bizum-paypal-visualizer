import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[conversion]'
})
/** Directiva que hace conversiones de texto. Opciones: Mayuscula, minuscula y número */
export class ConversionDirective {
    /** Tipo de conversión que ha de realizar */
    @Input('conversion') type: string;
    constructor(private _el: ElementRef) { }
    /** Escucha de evento de input */
    @HostListener('input', ['$event']) onInputChange(event) {
        const initalValue: string = this._el.nativeElement.value;
        if (this.type) {
            switch (this.type) {
                case 'mayuscula':
                    this._el.nativeElement.value = initalValue.toUpperCase();
                    break;
                case 'minuscula':
                    this._el.nativeElement.value = initalValue.toLowerCase();
                    break;
                case 'numero':
                    this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
                    break;
            }
            if (initalValue !== this._el.nativeElement.value) event.stopPropagation();
        }
    }
}
