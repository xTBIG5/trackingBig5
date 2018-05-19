import { Injectable } from '@angular/core';

@Injectable()
export class UserChartService {

  constructor() { }
  getBig5Result(id){
  	return {
  		user_id:12,
  		O: 12,
  		C: 90,
  		E: 40,
  		A: 37,
  		N: 60
  	}
  }

}
