import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';

//Otros módulos


//Componentes
import { ConversionDirective } from './directivas/conversion.directive';
import { DragAndDropDirective } from './directivas/dragAndDrop.directive';
import { MatErrorMessagesDirective } from './directivas/matErrorMessages.directive';
import { BuscadorComponent } from './formularios/buscador/buscador.component';
import { ConfirmacionComponent } from './formularios/confirmacion/confirmacion.component';
import { EditarGenericoComponent } from './formularios/editar-generico/editar-generico.component';
import { SelectMaestroComponent } from './formularios/select-maestro/select-maestro.component';
import { AccionTablaComponent } from './tablas/accion-tabla/accion-tabla.component';
import { ElementoTablaComponent } from './tablas/elemento-tabla/elemento-tabla.component';
import { TablaInfinitaComponent } from './tablas/tabla-infinita/tabla-infinita.component';
import { TablaComponent } from './tablas/tabla/tabla.component';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedService } from './shared.service';
import localeEs from '@angular/common/locales/es';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
// Españolización proyecto
registerLocaleData(localeEs, 'es');
export const MY_FORMATS = {
  parse: {
      dateInput: 'DD/MM/yyyy',
  },
  display: {
      dateInput: 'DD/MM/yyyy',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY',
  },
};

@NgModule({
  declarations: [
    EditarGenericoComponent,
    ConfirmacionComponent,
    ConversionDirective,
    DragAndDropDirective,
    MatErrorMessagesDirective,
    ElementoTablaComponent,
    AccionTablaComponent,
    TablaComponent,
    TablaInfinitaComponent,
    BuscadorComponent,
    SelectMaestroComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    TablaComponent,
    TablaInfinitaComponent,
    SelectMaestroComponent,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers:[SharedService,
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }]
})
export class SharedModule { }
