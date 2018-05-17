import { Component, OnInit } from '@angular/core';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component'
import { MapComponent } from '../map-dashboard/map/map.component'
import { GuarderService } from '../guarder.service'
import { Router } from '@angular/router'

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	userName=""

	constructor(private guarder:GuarderService, private router:Router) { }


	ngOnInit() {
	}
	isUser(){
		if(this.guarder.getType()==="user"){
			this.userName = this.guarder.getUserName()
			return true
		}
		return false
	}
	isManager(){
		if(this.guarder.getType()==="manager"){
			this.userName = this.guarder.getUserName()
			return true
		}
		return false
	}
	logOut(){
		this.guarder.logOut()
		this.router.navigate(['/login'])
	}

}
