import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { MapService } from './map.service';

//import { HttpClientModule } from '@angular/common/http';

import { HttpModule } from '@angular/http';
import { CountryMapComponent } from './country-map/country-map.component';
import { MapOptionComponent } from './map-option/map-option.component';
import { AdvanceOptionsComponent } from './advance-options/advance-options.component';
import { MapInforComponent } from './map-infor/map-infor.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    CountryMapComponent,
    MapOptionComponent,
    AdvanceOptionsComponent,
    MapInforComponent
  ],
  imports: [
    BrowserModule,
    //HttpClientModule,
    HttpModule,

  ],
  providers: [
  	MapService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
