import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/** Directiva para sanitizar el html, utilizado para cargar el ckeditor */
@Pipe({
    name: 'sanitizeHtml'
})
export class SanitizeHtml implements PipeTransform  {

   constructor(private _sanitizer: DomSanitizer){}
   /**
    * Función que transforma el texto a texto seguro por html
    *
    * @param v Texto a recibir
    * @returns Html
    */
   transform(v: string): SafeHtml {
      return this._sanitizer.bypassSecurityTrustHtml(v);
   }
}