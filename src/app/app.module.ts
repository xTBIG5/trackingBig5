import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MapComponent } from './map-dashboard/map/map.component';
import { MapService } from './service/map.service';
import { LoginComponent } from './login/login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AppRoutingModule } from './/app-routing.module';
import { UserChartComponent } from './user-chart/user-chart.component';
import { UserChartService } from './service/user-chart.service';

//import { HttpClientModule } from '@angular/common/http';

import { HttpModule } from '@angular/http';
import { CountryMapComponent } from './map-dashboard/country-map/country-map.component';
import { MapOptionComponent } from './map-dashboard/map-option/map-option.component';
import { AdvanceOptionsComponent } from './map-dashboard/advance-options/advance-options.component';
import { MapInforComponent } from './map-dashboard/map-infor/map-infor.component';
import { MatButtonModule} from '@angular/material';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';

import { SceneComponent } from './map-dashboard/scene/scene.component';
import { DrawToolComponent } from './map-dashboard/draw-tool/draw-tool.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GuarderGuard } from './guard/guarder.guard'
import { LoginGuard } from './guard/login.guard'
import { GuarderService } from './service/guarder.service';
import { ChartComponent } from './map-dashboard/chart/chart.component'

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    CountryMapComponent,
    MapOptionComponent,
    AdvanceOptionsComponent,
    MapInforComponent,
    SceneComponent,
    DrawToolComponent,
    LoginComponent,
    UserDashboardComponent,
    UserChartComponent,
    DashboardComponent,
    ChartComponent

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
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatRadioModule,
    MatTabsModule,
    MatSelectModule,
    MatIconModule
  ],
  providers: [
  	MapService,
    UserChartService,
    GuarderService,
    GuarderGuard,
    LoginGuard

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
