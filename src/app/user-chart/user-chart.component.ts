import { Component, OnInit } from '@angular/core';
import { UserChartService } from '../user-chart.service'

@Component({
  selector: 'tb-user-chart',
  templateUrl: './user-chart.component.html',
  styleUrls: ['./user-chart.component.css']
})
export class UserChartComponent implements OnInit {
	big5 = {}

	constructor(private userChartService: UserChartService) { }

	ngOnInit() {
		this.getBig5Result(12)
	}

	getBig5Result(id){
		this.big5 = this.userChartService.getBig5Result(12)
	}

	leveling(degree){
		if(degree>66)
			return 'High'
		if(degree>33)
			return 'Average'
		return 'Low'
	}
	xposition(level){
		if(level=='H')
			return 3
		if(level==='Average')
			return -2
		return 8
	}

}
