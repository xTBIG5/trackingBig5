import { Injectable } from '@angular/core';

@Injectable()
export class MapService {
  constructor() { };
  
  getUsers() {
  	var users = [
  		{
  			"id": 1,
  			"location": {
  				x: 80,
  				y: 80,
  			},
  			big5: 
  				{
  					o: 2,
  					c: 2,
  					e: 2,
  					a: 2,
  					n: 2,
  				}
  		},
  		{
  			id: 2,
  			location: {
  				x: 85,
  				y: 80,
  			},
  			big5: [
  				{
  					o: 2,
  					c: 2,
  					e: 2,
  					a: 2,
  					n: 2,
  				}
  			]
  		},
  		{
  			id: 3,
  			location: {
  				x: 90,
  				y: 86,
  			},
  			big5: [
  				{
  					o: 2,
  					c: 2,
  					e: 2,
  					a: 2,
  					n: 2,
  				}
  			]
  		}

  	];
  return users;
	}

}
