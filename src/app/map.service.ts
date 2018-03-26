import { Injectable } from '@angular/core';
import { Big5 } from './share/big5';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError/*, map*/, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';

import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class MapService {
  constructor(private http: Http) {  };
  
  /*getBig5s(){
    return this.http.get('/api/big5s')
      .pipe(
        tap(big5s => console.log(big5s[4])), //`do something such as send a message to log the success`
        catchError(this.handleError('getBig5s', []))
      );
  }*/
  getBig5s () {
    return this.http.get("/api/big5s")
      .map(result => this.shuffle(result.json().data))
      .pipe(
        tap(big5s => console.log(big5s[3])),
        catchError(this.handleError('getBig5s', []))
      );
  }
  getBig5sTest(){
    return [
      { "_id" : 1, "arr_id" : 2, "lon" : -17.525142, "lat" : 14.746832, "O" : 1, "C" : 2, "E" : 1, "A" : 1, "N" : 2 },
      { "_id" : 2, "arr_id" : 2, "lon" : -17.52436, "lat" : 14.747434, "O" : 2, "C" : 1, "E" : 2, "A" : 1, "N" : 3 },
      { "_id" : 3, "arr_id" : 2, "lon" : -17.522576, "lat" : 14.745198, "O" : 2, "C" : 3, "E" : 2, "A" : 1, "N" : 1 },
      { "_id" : 4, "arr_id" : 2, "lon" : -17.516398, "lat" : 14.74673, "O" : 3, "C" : 2, "E" : 1, "A" : 2, "N" : 2 },
      { "_id" : 5, "arr_id" : 2, "lon" : -17.51287, "lat" : 14.740658, "O" : 2, "C" : 2, "E" : 1, "A" : 3, "N" : 3 },
      { "_id" : 6, "arr_id" : 2, "lon" : -17.512103, "lat" : 14.748411, "O" : 1, "C" : 3, "E" : 1, "A" : 1, "N" : 2 },
      { "_id" : 7, "arr_id" : 2, "lon" : -17.510958, "lat" : 14.737403, "O" : 2, "C" : 1, "E" : 1, "A" : 3, "N" : 3 },
      { "_id" : 8, "arr_id" : 2, "lon" : -17.508395, "lat" : 14.730968, "O" : 2, "C" : 1, "E" : 2, "A" : 2, "N" : 2 },
      { "_id" : 9, "arr_id" : 2, "lon" : -17.507036, "lat" : 14.740671, "O" : 2, "C" : 1, "E" : 1, "A" : 1, "N" : 1 },
      { "_id" : 10, "arr_id" : 2, "lon" : -17.508766, "lat" : 14.747767, "O" : 3, "C" : 2, "E" : 3, "A" : 1, "N" : 2 },
      { "_id" : 11, "arr_id" : 2, "lon" : -17.505067, "lat" : 14.751808, "O" : 3, "C" : 1, "E" : 2, "A" : 1, "N" : 2 },
      { "_id" : 12, "arr_id" : 2, "lon" : -17.499875, "lat" : 14.754555, "O" : 2, "C" : 3, "E" : 1, "A" : 3, "N" : 2 },
      { "_id" : 13, "arr_id" : 2, "lon" : -17.497565, "lat" : 14.728712, "O" : 2, "C" : 2, "E" : 3, "A" : 1, "N" : 1 },
      { "_id" : 14, "arr_id" : 2, "lon" : -17.497759, "lat" : 14.732262, "O" : 2, "C" : 3, "E" : 2, "A" : 2, "N" : 1 },
      { "_id" : 15, "arr_id" : 2, "lon" : -17.49397, "lat" : 14.754447, "O" : 2, "C" : 3, "E" : 2, "A" : 1, "N" : 3 },
      { "_id" : 16, "arr_id" : 2, "lon" : -17.494845, "lat" : 14.724453, "O" : 3, "C" : 3, "E" : 2, "A" : 2, "N" : 2 },
      { "_id" : 17, "arr_id" : 2, "lon" : -17.490356, "lat" : 14.73377, "O" : 3, "C" : 3, "E" : 1, "A" : 2, "N" : 2 },
      { "_id" : 18, "arr_id" : 2, "lon" : -17.491645, "lat" : 14.727389, "O" : 3, "C" : 2, "E" : 2, "A" : 2, "N" : 2 },
      { "_id" : 19, "arr_id" : 2, "lon" : -17.491293, "lat" : 14.719656, "O" : 3, "C" : 1, "E" : 1, "A" : 1, "N" : 2 },
      { "_id" : 20, "arr_id" : 2, "lon" : -17.491396, "lat" : 14.756656, "O" : 3, "C" : 2, "E" : 2, "A" : 2, "N" : 1 }

    ]
  }
  shuffle(array) {
    let counter = array.length;
    let temp;
    let index;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}




  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
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
