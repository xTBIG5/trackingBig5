import { Component, OnInit, Input} from '@angular/core';
import { MapComponent } from '../map/map.component';
@Component({
  selector: 'tb-country-map',
  templateUrl: './country-map.component.html',
  styleUrls: ['./country-map.component.css']
})
export class CountryMapComponent implements OnInit {
  @Input() map: MapComponent;

  hover = ['#C6BF9D','#C6BF9D','#C6BF9D','#C6BF9D','#C6BF9D','#C6BF9D','#C6BF9D',
            '#C6BF9D','#C6BF9D','#C6BF9D','#C6BF9D','#C6BF9D','#C6BF9D','#C6BF9D',]

  constructor() { }

  ngOnInit() {
    
    this.map.latitude_    = 14.5;
    this.map.longitude_   = -14.5;
    this.map.y_ = 12.6 + 136.94363271933562;
    this.map.x_ = 12.6 + 186.63049838495695;
    this.map.x_x_Width    = 383.088901314467 - 186.63049838495695;
    this.map.y_y_Height   = 271.78538763862565 - 136.94363271933562;
    this.map.dlat = 2;
    this.map.dlon = 3;

    //testdata
    //this.map.getBig5sTest(this.getCountryMapCollection)

    if(this.map.big5Collection)
      this.map.big5s = this.getCountryMapCollection(this.map.big5Collection)
    else
      this.map.getBig5s(this.getCountryMapCollection)

  }

  getCountryMapCollection(collection){

    return collection
  }

  mouseenter(index){
    this.hover[index] = '#A9B39A'
  }
  mouseleave(index){
    this.hover[index] = '#C6BF9D'
  }

}
