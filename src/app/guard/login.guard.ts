import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GuarderService  } from '../service/guarder.service'
import { Router } from '@angular/router'


@Injectable()
export class LoginGuard implements CanActivate {
	constructor(private guarder: GuarderService, private router: Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  	if(this.guarder.isAccepted()){
  		this.router.navigate(['/dashboard'])
  		return false
  	}
    return true
  }
}
