import { Component, OnInit } from '@angular/core';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component'
import { MapComponent } from '../map-dashboard/map/map.component'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
