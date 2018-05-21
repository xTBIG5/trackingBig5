import { CommonModule } from '@angular/common';
import { Routes, RouterModule, } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GuarderGuard } from './guard/guarder.guard'
import { LoginGuard } from './guard/login.guard'

const routes: Routes = [  
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	//{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'login', canActivate:[LoginGuard], component: LoginComponent },
    { path: 'dashboard', canActivate:[GuarderGuard], component: DashboardComponent },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}