import { Component, OnInit, Input} from '@angular/core';
import { MapComponent } from '../map/map.component';
@Component({
  selector: 'tb-country-map',
  templateUrl: './country-map.component.html',
  styleUrls: ['./country-map.component.css']
})
export class CountryMapComponent implements OnInit {
  @Input() map: MapComponent;
  constructor() { }

  ngOnInit() {
  }

}
