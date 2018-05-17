import { Component, OnInit } from '@angular/core';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component'
import { MapComponent } from '../map-dashboard/map/map.component'
import { GuarderService } from '../guarder.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private guarder:GuarderService) { }

  ngOnInit() {
  }
  isUser(){
  	if(this.guarder.getType()==="user")
  		return true
  	return false
  }
  isManager(){
  	if(this.guarder.getType()==="manager")
  		return true
  	return false
  }

}
