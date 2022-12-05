import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/** Clase utilizada para mostrar un breve dialogo de confirmación */
@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.scss']
})
export class ConfirmacionComponent implements OnInit {
  /** Mensaje a mostrar */
  mensaje: string;
  constructor(private dialogRef: MatDialogRef<ConfirmacionComponent>) { }

  ngOnInit(): void {
  }
  /** Confirmación del dialogo */
  save(): void {
    this.dialogRef.close(true);
  }
  /** Cancelación del dialogo */
  close(): void {
    this.dialogRef.close(false);
  }

}
