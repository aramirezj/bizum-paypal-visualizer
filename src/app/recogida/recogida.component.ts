import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Pago } from '../interfaces/Pago';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-recogida',
  templateUrl: './recogida.component.html',
  styleUrls: ['./recogida.component.scss']
})
export class RecogidaComponent {

  form: FormGroup;
  bizums: Pago[];
  paypals: Pago[];

  @Output() bizumsE: EventEmitter<Pago[]> = new EventEmitter();
  @Output() paypalsE: EventEmitter<Pago[]> = new EventEmitter();
  constructor(
    private fileService: FileService,

  ) { }
  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      inputSms: new FormControl(),
      inputPaypal: new FormControl()
    })
  }


  /** Funciones relativas a la subida de ficheros
  * @param Evento de la imagen subida
  */
  async SmsSubido(event: any): Promise<void> {
    if (event.target.files.length > 0) {
      const rawFiles: File[] = event.target.files;
      const textosXML: string[] = [];
      let errores: boolean = false;
      const formatosValidos: boolean = this.fileService.bizumsValidos(rawFiles);
      if (formatosValidos) {
        for (const file of rawFiles) {
          const contenido: string = await this.readFileContent(file);
          textosXML.push(contenido);
        }
        this.bizums = this.fileService.parseaXML(textosXML);
      }

      this.bizumsE.emit(this.bizums);
    }




  }

  /** Funciones relativas a la subida de ficheros
* @param Evento de la imagen subida
*/
  async paypalSubido(event: any): Promise<void> {
    if (event.target.files.length > 0) {
      const rawFiles: File[] = event.target.files;
      const textosCSV: string[] = [];
      const formatosValidos: boolean = this.fileService.paypalsValidos(rawFiles);
      if (formatosValidos) {
        for (const file of rawFiles) {
          const contenido: string = await this.readFileContent(file);
          textosCSV.push(contenido);
        }
      }

      this.paypals = this.fileService.parseaCSV(textosCSV);
      this.paypalsE.emit(this.paypals);
    }

  }


  /**
   * Lee el contenido del fichero en texto
   * @param file 
   * @returns 
   */
  readFileContent(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!file) {
        resolve('');
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = reader.result.toString();
        resolve(text);

      };
      reader.readAsText(file);
    });
  }
}
