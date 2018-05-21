import { Component, OnInit, Input } from '@angular/core';
import { MapComponent } from '../map/map.component'

@Component({
	selector: 'tb-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
   @Input() map: MapComponent
   dims = [
   	{L:.3,A:.3,H:.4},
   	{L:.3,A:.3,H:.4},
   	{L:.3,A:.3,H:.4},
   	{L:.3,A:.3,H:.4},
   	{L:.3,A:.3,H:.4},
   ]
   rectWidth = 40
   baseWidth = 460
   baseHeight = 300
   edgeWidth = 90
   betweenWidth = 20
   bottonBase = this.baseHeight - 40
   topBase = 40
   height = this.bottonBase-this.topBase
   padingW = 40
   padingH = 5
   points = this.edgeWidth-this.padingW+','+(this.topBase-this.padingH)+' '+(this.edgeWidth-this.padingW)+','+(this.bottonBase+this.padingH)+' '+(this.edgeWidth+4*(this.betweenWidth+this.rectWidth)+this.rectWidth+this.padingW)+','+(this.bottonBase+this.padingH)

	constructor() { }

	ngOnInit() {
		this.map.chartComponent = this
	}


}
