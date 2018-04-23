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
import { MatButtonModule, MatCheckboxModule} from '@angular/material';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SceneComponent } from './scene/scene.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    CountryMapComponent,
    MapOptionComponent,
    AdvanceOptionsComponent,
    MapInforComponent,
    SceneComponent,

  ],
  imports: [
    BrowserModule,
    //HttpClientModule,
    HttpModule,
    MatButtonModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
  ],
  providers: [
  	MapService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
