import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraficosComponent } from './graficos/graficos.component';
import { RecogidaComponent } from './recogida/recogida.component';
import { FileService } from './services/file.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';

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
    AppComponent,
    GraficosComponent,
    RecogidaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    NgxCsvParserModule,
    NgxChartsModule,
    MatDatepickerModule
  ],
  providers: [    { provide: LOCALE_ID, useValue: 'es-ES' },
  { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },FileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
