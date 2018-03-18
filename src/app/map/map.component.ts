import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
	users: any;
	//mapService MapService
  constructor( private mapService: MapService ) { }

  ngOnInit() {
  	this.getUsers();
  	
  }

  getUsers(): void {
  	this.users = this.mapService.getUsers();
  }

}
