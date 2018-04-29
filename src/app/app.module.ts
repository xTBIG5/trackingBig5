import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { MapService } from './map.service';
import { LoginComponent } from './login/login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LoginComponent,
    UserDashboardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
  	MapService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
