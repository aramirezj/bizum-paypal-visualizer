import { Directive, ElementRef, HostListener, HostBinding, Output, EventEmitter } from '@angular/core';
import { keyframes } from '@angular/animations';

@Directive({
    selector: '[dragAndDrop]'
})
/** Clase que gestiona si un elemento o no es dragable */
export class DragAndDropDirective {
    /** Pues ni idea la verdad */
    @HostBinding('class.fileover') fileOver: boolean;
    /** Evento que emite un elemento cuando detecta que se ha terminado el drageo */
    @Output() fileDropped = new EventEmitter();
    constructor(private _el: ElementRef) { }
    /** Escucha de cuando comienza a dragear */
    @HostListener('dragover', ['$event']) onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.fileOver = true;
    }
    /** Escucha de cuando se termina de dragear */
    @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }
    /** Escucha de evento de finalización de drageo */
    @HostListener('drop', ['$event']) public onDrop(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.fileOver = false;
        const files = evt.dataTransfer.files;
        if (files.length > 0) {
            this.fileDropped.emit(files);
        }
    }
}

