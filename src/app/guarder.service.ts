import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError/*, map*/, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';

import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class GuarderService {
	user = {
		_id:null,
		type:null
	}

	constructor(private http: Http) { }

	setUser(user){
		this.user = user
	}
	getUser(userName,password) {
		return this.http.get("/api/user/:"+userName+'/:'+password)
		.map(user => user.json().data)
		.pipe(
			tap(user => console.log(user)),
			catchError(this.handleError('getUser', []))
			);
	}
	getUserTest(userName,password) {
		let users=[{_id:1, user_name:"1234567890", password:"123456789",type:1},
		{_id:170000, user_name:"kai", password:"123",type:2}]
		if(userName===users[0].user_name&&password===users[0].password)
			return users[0]
		if(userName===users[1].user_name&&password===users[1].password)
			return users[1]
		return {_id:null}
	}

	isAccepted(){
		if(this.user._id)
			return true
		return false
	}
	getType(){
		if(this.user.type===1)
			return 'user'
		return 'manager'
	}




	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
   };
}

}
