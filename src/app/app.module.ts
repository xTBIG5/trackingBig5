import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { MapService } from './map.service';
import { LoginComponent } from './login/login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AppRoutingModule } from './/app-routing.module';
import { UserChartComponent } from './user-chart/user-chart.component';
import { UserChartService } from './user-chart.service';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LoginComponent,
    UserDashboardComponent,
    UserChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
  	MapService,
    UserChartService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
