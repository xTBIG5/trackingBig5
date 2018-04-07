import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'tb-map-infor',
  templateUrl: './map-infor.component.html',
  styleUrls: ['./map-infor.component.css']
})
export class MapInforComponent implements OnInit {
  @Input() big5s: any
  constructor() { }

  ngOnInit() {
  }

}
