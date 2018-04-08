import { Component, OnInit, Input} from '@angular/core';
import { MapComponent } from '../map/map.component'

@Component({
  selector: 'tb-map-infor',
  templateUrl: './map-infor.component.html',
  styleUrls: ['./map-infor.component.css']
})
export class MapInforComponent implements OnInit {
  @Input() map: MapComponent
  constructor() { }

  ngOnInit() {
  }

}
