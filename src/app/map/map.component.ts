import { Component, OnInit, AfterViewInit } from '@angular/core';
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
    console.log('ewrqrqwerwerqrewrq\nerqkjlklkj');
  }
  ngAfterViewInit() {
       //Copy in all the js code from the script.js. Typescript will complain but it works just fine
       console.log("do after init");
   }
  getUsers(): void {
    this.users = this.mapService.getUsers();
  }

}
