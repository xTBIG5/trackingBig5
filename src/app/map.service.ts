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
  getBig5sTest_(){
    return [
      { _id: 7, arr_id: 2, lon: -17.510958, lat: 14.737403, O: 2, C: 1, E: 1, A: 1, N: 3 },
      { _id: 14, arr_id: 2, lon: -17.497759, lat: 14.732262, O: 2, C: 3, E: 2, A: 2, N: 1 },
      { _id: 21, arr_id: 2, lon: -17.487934, lat: 14.750047, O: 3, C: 1, E: 1, A: 1, N: 2 },
      { _id: 28, arr_id: 2, lon: -17.480833, lat: 14.724458, O: 1, C: 2, E: 3, A: 1, N: 2 },
      { _id: 35, arr_id: 2, lon: -17.474797, lat: 14.760298, O: 1, C: 2, E: 2, A: 3, N: 2 },
      { _id: 42, arr_id: 2, lon: -17.475318, lat: 14.75645, O: 1, C: 3, E: 1, A: 2, N: 1 },]}

  getBig5sTest(){
    return [{'_id': 1070, 'arr_id': 31, 'lon': -15.86793, 'lat': 14.541283, 'O': 1, 'C': 1, 'E': 1, 'A': 2, 'N': 1}, {'_id': 1072, 'arr_id': 31, 'lon': -15.826159, 'lat': 14.484237, 'O': 2, 'C': 3, 'E': 2, 'A': 2, 'N': 2}, {'_id': 1084, 'arr_id': 31, 'lon': -15.836631, 'lat': 14.396967, 'O': 1, 'C': 1, 'E': 2, 'A': 1, 'N': 1}, {'_id': 1103, 'arr_id': 31, 'lon': -15.736512, 'lat': 14.520198, 'O': 2, 'C': 2, 'E': 3, 'A': 1, 'N': 2}, {'_id': 1120, 'arr_id': 31, 'lon': -15.672044, 'lat': 14.610167, 'O': 3, 'C': 3, 'E': 1, 'A': 2, 'N': 1}, {'_id': 1156, 'arr_id': 31, 'lon': -15.574925, 'lat': 14.564224, 'O': 2, 'C': 2, 'E': 2, 'A': 2, 'N': 3}]
    
 }

  getBig5sTest2(){
    return [
      { _id: 7, arr_id: 2, lon: -17.510958, lat: 14.737403, O: 2, C: 1, E: 1, A: 3, N: 3 },
      { _id: 14, arr_id: 2, lon: -17.497759, lat: 14.732262, O: 2, C: 3, E: 2, A: 2, N: 1 },
      { _id: 21, arr_id: 2, lon: -17.487934, lat: 14.750047, O: 1, C: 1, E: 1, A: 1, N: 2 },
      { _id: 28, arr_id: 2, lon: -17.480833, lat: 14.724458, O: 3, C: 3, E: 3, A: 3, N: 2 },
      { _id: 35, arr_id: 2, lon: -17.474797, lat: 14.760298, O: 3, C: 2, E: 2, A: 1, N: 2 },
      { _id: 42, arr_id: 2, lon: -17.475318, lat: 14.75645, O: 1, C: 3, E: 1, A: 2, N: 1 },
      { _id: 49, arr_id: 3, lon: -17.470591, lat: 14.728215, O: 3, C: 2, E: 3, A: 2, N: 1 },
      { _id: 56, arr_id: 2, lon: -17.469568, lat: 14.745296, O: 3, C: 2, E: 3, A: 3, N: 1 },
      { _id: 63, arr_id: 2, lon: -17.468546, lat: 14.748886, O: 2, C: 3, E: 2, A: 3, N: 2 },
      { _id: 70, arr_id: 4, lon: -17.465813, lat: 14.699413, O: 2, C: 1, E: 2, A: 1, N: 3 },
      { _id: 77, arr_id: 4, lon: -17.466756, lat: 14.685505, O: 2, C: 2, E: 3, A: 1, N: 1 },
      { _id: 84, arr_id: 2, lon: -17.461845, lat: 14.707758, O: 3, C: 2, E: 3, A: 3, N: 3 },
      { _id: 91, arr_id: 4, lon: -17.462261, lat: 14.698695, O: 2, C: 1, E: 1, A: 1, N: 3 },
      { _id: 98, arr_id: 2, lon: -17.459463, lat: 14.752255, O: 2, C: 2, E: 3, A: 2, N: 2 },
      { _id: 105, arr_id: 4, lon: -17.459146, lat: 14.701626, O: 3, C: 3, E: 3, A: 2, N: 2 },
      { _id: 112, arr_id: 1, lon: -17.457446, lat: 14.744069, O: 3, C: 3, E: 1, A: 1, N: 2 },
      { _id: 119, arr_id: 1, lon: -17.45617, lat: 14.734001, O: 3, C: 2, E: 2, A: 1, N: 2 },
      { _id: 126, arr_id: 3, lon: -17.455121, lat: 14.721854, O: 3, C: 1, E: 2, A: 3, N: 2 },
      { _id: 133, arr_id: 1, lon: -17.453738, lat: 14.747978, O: 1, C: 1, E: 3, A: 2, N: 2 },
      { _id: 140, arr_id: 4, lon: -17.45344, lat: 14.683465, O: 3, C: 2, E: 2, A: 3, N: 2 },
      { _id: 147, arr_id: 4, lon: -17.451185, lat: 14.67856, O: 3, C: 2, E: 2, A: 1, N: 2 },
      { _id: 154, arr_id: 1, lon: -17.451419, lat: 14.73213, O: 3, C: 2, E: 2, A: 2, N: 2 },
      { _id: 161, arr_id: 4, lon: -17.450404, lat: 14.690296, O: 2, C: 1, E: 3, A: 3, N: 1 },
      { _id: 168, arr_id: 3, lon: -17.448846, lat: 14.714874, O: 1, C: 1, E: 2, A: 3, N: 1 },
      { _id: 175, arr_id: 4, lon: -17.447423, lat: 14.672989, O: 2, C: 1, E: 2, A: 2, N: 2 },
      { _id: 182, arr_id: 1, lon: -17.44496, lat: 14.736088, O: 2, C: 2, E: 1, A: 2, N: 3 },
      { _id: 189, arr_id: 1, lon: -17.444715, lat: 14.738841, O: 3, C: 3, E: 2, A: 2, N: 1 },
      { _id: 196, arr_id: 1, lon: -17.443766, lat: 14.760615, O: 1, C: 3, E: 2, A: 3, N: 3 },
      { _id: 203, arr_id: 1, lon: -17.441609, lat: 14.75008, O: 2, C: 2, E: 2, A: 2, N: 3 },
      { _id: 210, arr_id: 3, lon: -17.442384, lat: 14.723569, O: 2, C: 2, E: 3, A: 3, N: 3 },
      { _id: 217, arr_id: 4, lon: -17.439632, lat: 14.672184, O: 2, C: 3, E: 2, A: 2, N: 3 },
      { _id: 224, arr_id: 3, lon: -17.439075, lat: 14.704144, O: 3, C: 2, E: 2, A: 3, N: 3 },
      { _id: 231, arr_id: 3, lon: -17.439254, lat: 14.735788, O: 3, C: 1, E: 1, A: 3, N: 1 },
      { _id: 238, arr_id: 1, lon: -17.435953, lat: 14.761432, O: 2, C: 1, E: 2, A: 3, N: 2 },
      { _id: 245, arr_id: 3, lon: -17.436633, lat: 14.739359, O: 3, C: 3, E: 2, A: 1, N: 3 },
      { _id: 252, arr_id: 3, lon: -17.433045, lat: 14.692323, O: 3, C: 1, E: 1, A: 3, N: 1 },
      { _id: 259, arr_id: 1, lon: -17.431178, lat: 14.751528, O: 3, C: 2, E: 3, A: 1, N: 2 },
      { _id: 266, arr_id: 3, lon: -17.431201, lat: 14.739776, O: 2, C: 1, E: 2, A: 1, N: 1 },
      { _id: 273, arr_id: 3, lon: -17.429871, lat: 14.734365, O: 2, C: 3, E: 1, A: 1, N: 3 },
      { _id: 280, arr_id: 5, lon: -17.425364, lat: 14.760166, O: 3, C: 1, E: 3, A: 2, N: 2 },
      { _id: 287, arr_id: 3, lon: -17.424548, lat: 14.744221, O: 1, C: 2, E: 2, A: 2, N: 1 },
      { _id: 294, arr_id: 1, lon: -17.420754, lat: 14.772338, O: 3, C: 1, E: 2, A: 1, N: 3 },
      { _id: 301, arr_id: 6, lon: -17.413631, lat: 14.738052, O: 2, C: 3, E: 2, A: 1, N: 3 },
      { _id: 308, arr_id: 5, lon: -17.409955, lat: 14.767178, O: 1, C: 3, E: 2, A: 2, N: 2 },
      { _id: 315, arr_id: 5, lon: -17.401944, lat: 14.772847, O: 2, C: 3, E: 2, A: 2, N: 2 },
      { _id: 322, arr_id: 5, lon: -17.398166, lat: 14.778446, O: 1, C: 2, E: 2, A: 3, N: 2 },
      { _id: 329, arr_id: 6, lon: -17.393672, lat: 14.760057, O: 3, C: 2, E: 2, A: 1, N: 3 },
      { _id: 336, arr_id: 5, lon: -17.390437, lat: 14.784365, O: 2, C: 3, E: 2, A: 1, N: 2 },
      { _id: 343, arr_id: 6, lon: -17.385586, lat: 14.762934, O: 3, C: 1, E: 2, A: 2, N: 1 },
      { _id: 350, arr_id: 6, lon: -17.380425, lat: 14.761916, O: 2, C: 2, E: 1, A: 1, N: 1 },
      { _id: 357, arr_id: 5, lon: -17.377095, lat: 14.78535, O: 1, C: 2, E: 3, A: 1, N: 1 },
      { _id: 364, arr_id: 7, lon: -17.371919, lat: 14.742478, O: 3, C: 1, E: 1, A: 3, N: 2 },
      { _id: 371, arr_id: 7, lon: -17.367944, lat: 14.746567, O: 3, C: 2, E: 2, A: 1, N: 1 },
      { _id: 378, arr_id: 8, lon: -17.363901, lat: 14.76533, O: 3, C: 2, E: 1, A: 2, N: 3 },
      { _id: 385, arr_id: 7, lon: -17.35927, lat: 14.754807, O: 1, C: 3, E: 2, A: 1, N: 2 },
      { _id: 392, arr_id: 8, lon: -17.355092, lat: 14.76538, O: 3, C: 2, E: 2, A: 3, N: 2 },
      { _id: 399, arr_id: 7, lon: -17.345369, lat: 14.754224, O: 2, C: 2, E: 3, A: 3, N: 2 },
      { _id: 406, arr_id: 8, lon: -17.339373, lat: 14.792272, O: 2, C: 1, E: 3, A: 2, N: 2 },
      { _id: 413, arr_id: 8, lon: -17.327621, lat: 14.791916, O: 2, C: 2, E: 3, A: 3, N: 1 },
      { _id: 420, arr_id: 8, lon: -17.316665, lat: 14.776986, O: 2, C: 1, E: 2, A: 3, N: 3 },
      { _id: 427, arr_id: 8, lon: -17.308942, lat: 14.776337, O: 2, C: 1, E: 1, A: 3, N: 3 },
      { _id: 434, arr_id: 9, lon: -17.299874, lat: 14.72093, O: 2, C: 1, E: 2, A: 2, N: 1 },
      { _id: 441, arr_id: 9, lon: -17.283862, lat: 14.731798, O: 3, C: 1, E: 2, A: 1, N: 2 },
      { _id: 448, arr_id: 9, lon: -17.276849, lat: 14.717804, O: 1, C: 3, E: 2, A: 1, N: 1 },
      { _id: 455, arr_id: 9, lon: -17.272012, lat: 14.733086, O: 3, C: 3, E: 2, A: 3, N: 2 },
      { _id: 462, arr_id: 9, lon: -17.26271, lat: 14.717958, O: 3, C: 2, E: 3, A: 1, N: 2 },
      { _id: 469, arr_id: 10, lon: -17.246589, lat: 14.806147, O: 2, C: 1, E: 3, A: 1, N: 3 },
      { _id: 476, arr_id: 10, lon: -17.22415, lat: 14.694309, O: 2, C: 1, E: 2, A: 2, N: 2 },
      { _id: 483, arr_id: 10, lon: -17.152019, lat: 14.625859, O: 1, C: 3, E: 3, A: 3, N: 3 },
      { _id: 490, arr_id: 10, lon: -17.120247, lat: 14.741666, O: 1, C: 1, E: 1, A: 1, N: 2 },
      { _id: 497, arr_id: 12, lon: -17.100163, lat: 14.621167, O: 2, C: 2, E: 2, A: 2, N: 2 },
      { _id: 504, arr_id: 12, lon: -17.05194, lat: 14.459822, O: 1, C: 2, E: 2, A: 3, N: 3 },
      { _id: 511, arr_id: 12, lon: -17.015126, lat: 14.443816, O: 1, C: 2, E: 2, A: 1, N: 2 },
      { _id: 518, arr_id: 12, lon: -16.985425, lat: 14.441856, O: 1, C: 2, E: 2, A: 1, N: 1 },
      { _id: 525, arr_id: 12, lon: -16.966033, lat: 14.421282, O: 1, C: 1, E: 2, A: 3, N: 2 },
      { _id: 532, arr_id: 12, lon: -16.960007, lat: 14.419839, O: 2, C: 1, E: 3, A: 2, N: 1 },
      { _id: 539, arr_id: 19, lon: -16.950122, lat: 14.770019, O: 1, C: 2, E: 3, A: 2, N: 1 },
      { _id: 546, arr_id: 19, lon: -16.936045, lat: 14.773727, O: 1, C: 1, E: 2, A: 2, N: 3 },
      { _id: 553, arr_id: 19, lon: -16.934769, lat: 14.785081, O: 2, C: 1, E: 3, A: 2, N: 3 },
      { _id: 560, arr_id: 19, lon: -16.926076, lat: 14.778249, O: 3, C: 3, E: 3, A: 2, N: 2 },
      { _id: 567, arr_id: 19, lon: -16.918491, lat: 14.788781, O: 3, C: 2, E: 3, A: 2, N: 1 },
      { _id: 574, arr_id: 19, lon: -16.909232, lat: 14.787246, O: 3, C: 2, E: 2, A: 2, N: 1 },
      { _id: 581, arr_id: 16, lon: -16.911354, lat: 15.060643, O: 3, C: 3, E: 2, A: 2, N: 2 },
      { _id: 588, arr_id: 13, lon: -16.836115, lat: 14.643632, O: 1, C: 1, E: 1, A: 1, N: 3 },
      { _id: 595, arr_id: 22, lon: -16.846677, lat: 14.432505, O: 3, C: 2, E: 1, A: 2, N: 1 },
      { _id: 602, arr_id: 16, lon: -16.802606, lat: 15.048818, O: 3, C: 2, E: 1, A: 3, N: 1 },
      { _id: 609, arr_id: 15, lon: -16.806563, lat: 14.953608, O: 2, C: 2, E: 3, A: 3, N: 3 },
      { _id: 616, arr_id: 22, lon: -16.777628, lat: 14.176316, O: 2, C: 3, E: 2, A: 2, N: 2 },
      { _id: 623, arr_id: 22, lon: -16.756144, lat: 14.335646, O: 3, C: 1, E: 3, A: 2, N: 2 },
      { _id: 630, arr_id: 16, lon: -16.754033, lat: 15.19931, O: 3, C: 2, E: 1, A: 3, N: 2 },
      { _id: 637, arr_id: 36, lon: -16.729769, lat: 14.07001, O: 3, C: 2, E: 3, A: 3, N: 2 },
      { _id: 644, arr_id: 44, lon: -16.725341, lat: 15.42581, O: 2, C: 2, E: 3, A: 2, N: 3 },
      { _id: 651, arr_id: 14, lon: -16.647463, lat: 14.648683, O: 3, C: 3, E: 2, A: 2, N: 2 },
      { _id: 658, arr_id: 38, lon: -16.616088, lat: 13.721155, O: 2, C: 3, E: 2, A: 2, N: 2 },
      { _id: 665, arr_id: 37, lon: -16.565036, lat: 14.009405, O: 1, C: 2, E: 1, A: 1, N: 1 },
      { _id: 672, arr_id: 97, lon: -16.560442, lat: 13.138306, O: 2, C: 2, E: 3, A: 2, N: 1 },
      { _id: 679, arr_id: 17, lon: -16.536303, lat: 15.072466, O: 1, C: 2, E: 2, A: 1, N: 1 },
      { _id: 686, arr_id: 36, lon: -16.503666, lat: 14.258183, O: 1, C: 2, E: 2, A: 2, N: 2 },
      { _id: 693, arr_id: 73, lon: -16.508325, lat: 16.030806, O: 2, C: 1, E: 1, A: 2, N: 1 },
      { _id: 700, arr_id: 30, lon: -16.495091, lat: 14.929207, O: 1, C: 1, E: 1, A: 3, N: 2 },
      { _id: 707, arr_id: 73, lon: -16.491547, lat: 16.001904, O: 2, C: 3, E: 2, A: 3, N: 2 },
      { _id: 714, arr_id: 38, lon: -16.471165, lat: 13.761868, O: 2, C: 1, E: 2, A: 2, N: 1 },
      { _id: 721, arr_id: 73, lon: -16.484611, lat: 16.029564, O: 2, C: 3, E: 1, A: 1, N: 3 },
      { _id: 728, arr_id: 99, lon: -16.467183, lat: 12.546199, O: 1, C: 2, E: 1, A: 2, N: 2 },
      { _id: 735, arr_id: 98, lon: -16.412233, lat: 12.671808, O: 3, C: 1, E: 2, A: 2, N: 1 },
      { _id: 742, arr_id: 98, lon: -16.430429, lat: 12.821592, O: 2, C: 1, E: 3, A: 2, N: 1 },
      { _id: 749, arr_id: 33, lon: -16.419949, lat: 14.306098, O: 2, C: 3, E: 2, A: 1, N: 3 },
      { _id: 756, arr_id: 30, lon: -16.391594, lat: 14.970433, O: 1, C: 2, E: 3, A: 1, N: 3 },
      { _id: 763, arr_id: 98, lon: -16.358047, lat: 12.846507, O: 1, C: 1, E: 1, A: 2, N: 3 },
      { _id: 770, arr_id: 98, lon: -16.370526, lat: 12.772247, O: 3, C: 1, E: 2, A: 3, N: 2 },
      { _id: 777, arr_id: 38, lon: -16.335941, lat: 13.767436, O: 2, C: 2, E: 3, A: 3, N: 1 },
      { _id: 784, arr_id: 45, lon: -16.325065, lat: 15.345508, O: 3, C: 2, E: 3, A: 1, N: 2 },
      { _id: 791, arr_id: 100, lon: -16.299835, lat: 12.583548, O: 1, C: 2, E: 2, A: 3, N: 3 },
      { _id: 798, arr_id: 35, lon: -16.284705, lat: 14.437827, O: 1, C: 3, E: 1, A: 1, N: 2 },
      { _id: 805, arr_id: 70, lon: -16.274695, lat: 16.326198, O: 3, C: 2, E: 2, A: 1, N: 2 },
      { _id: 812, arr_id: 100, lon: -16.273281, lat: 12.568511, O: 2, C: 3, E: 1, A: 2, N: 2 },
      { _id: 819, arr_id: 53, lon: -16.257727, lat: 14.267236, O: 1, C: 1, E: 2, A: 2, N: 3 },
      { _id: 826, arr_id: 100, lon: -16.258773, lat: 12.57614, O: 2, C: 1, E: 2, A: 2, N: 2 },
      { _id: 833, arr_id: 45, lon: -16.258177, lat: 15.222372, O: 2, C: 2, E: 1, A: 3, N: 3 },
      { _id: 840, arr_id: 96, lon: -16.251837, lat: 12.747246, O: 2, C: 2, E: 2, A: 2, N: 3 },
      { _id: 847, arr_id: 26, lon: -16.236649, lat: 14.656394, O: 3, C: 2, E: 2, A: 3, N: 2 },
      { _id: 854, arr_id: 26, lon: -16.233283, lat: 14.660554, O: 2, C: 2, E: 2, A: 2, N: 1 },
      { _id: 861, arr_id: 42, lon: -16.230479, lat: 15.623292, O: 2, C: 1, E: 3, A: 2, N: 2 },
      { _id: 868, arr_id: 42, lon: -16.222951, lat: 15.626111, O: 3, C: 3, E: 2, A: 3, N: 2 },
      { _id: 875, arr_id: 42, lon: -16.216827, lat: 15.625308, O: 2, C: 2, E: 3, A: 1, N: 2 },
      { _id: 882, arr_id: 46, lon: -16.212495, lat: 15.135699, O: 1, C: 3, E: 2, A: 3, N: 2 },
      { _id: 889, arr_id: 45, lon: -16.181677, lat: 15.277236, O: 3, C: 3, E: 2, A: 2, N: 2 },
      { _id: 896, arr_id: 55, lon: -16.121411, lat: 13.926764, O: 2, C: 2, E: 2, A: 3, N: 2 },
      { _id: 903, arr_id: 70, lon: -16.131782, lat: 16.22935, O: 3, C: 3, E: 1, A: 2, N: 3 },
      { _id: 910, arr_id: 51, lon: -16.105113, lat: 14.244533, O: 1, C: 2, E: 2, A: 3, N: 2 },
      { _id: 917, arr_id: 57, lon: -16.07603, lat: 13.632263, O: 2, C: 3, E: 3, A: 3, N: 3 },
      { _id: 924, arr_id: 54, lon: -16.081306, lat: 14.160269, O: 2, C: 1, E: 2, A: 3, N: 3 },
      { _id: 931, arr_id: 54, lon: -16.074498, lat: 14.157482, O: 2, C: 2, E: 2, A: 3, N: 3 },
      { _id: 938, arr_id: 54, lon: -16.061214, lat: 14.15186, O: 2, C: 2, E: 3, A: 2, N: 2 },
      { _id: 945, arr_id: 96, lon: -16.06836, lat: 12.706287, O: 2, C: 2, E: 1, A: 3, N: 3 },
      { _id: 952, arr_id: 43, lon: -16.034208, lat: 15.533732, O: 2, C: 1, E: 3, A: 2, N: 3 },
      { _id: 959, arr_id: 24, lon: -16.016611, lat: 14.722229, O: 1, C: 2, E: 2, A: 2, N: 3 },
      { _id: 966, arr_id: 24, lon: -16.010116, lat: 14.604631, O: 1, C: 1, E: 3, A: 3, N: 1 },
      { _id: 973, arr_id: 92, lon: -15.977668, lat: 12.832496, O: 1, C: 2, E: 2, A: 2, N: 2 },
      { _id: 980, arr_id: 25, lon: -15.9956, lat: 14.77639, O: 2, C: 2, E: 2, A: 3, N: 3 },
      { _id: 987, arr_id: 52, lon: -15.972175, lat: 14.296233, O: 2, C: 2, E: 2, A: 3, N: 1 },
      { _id: 994, arr_id: 41, lon: -16.02154, lat: 15.78669, O: 1, C: 1, E: 3, A: 2, N: 3 },
      { _id: 1001, arr_id: 56, lon: -15.895516, lat: 13.737953, O: 1, C: 3, E: 1, A: 3, N: 2 },
      { _id: 1008, arr_id: 25, lon: -15.897112, lat: 14.804338, O: 3, C: 2, E: 3, A: 1, N: 1 },
      { _id: 1015, arr_id: 25, lon: -15.907647, lat: 14.896258, O: 2, C: 2, E: 1, A: 2, N: 2 },
      { _id: 1022, arr_id: 25, lon: -15.899462, lat: 14.848018, O: 1, C: 1, E: 3, A: 1, N: 2 },
      { _id: 1029, arr_id: 70, lon: -15.898545, lat: 16.300248, O: 3, C: 3, E: 2, A: 1, N: 3 },
      { _id: 1036, arr_id: 25, lon: -15.882526, lat: 14.87275, O: 1, C: 3, E: 2, A: 3, N: 1 },
      { _id: 1043, arr_id: 25, lon: -15.87807, lat: 14.866479, O: 1, C: 3, E: 2, A: 2, N: 2 },
      { _id: 1050, arr_id: 25, lon: -15.874188, lat: 14.858895, O: 3, C: 2, E: 2, A: 1, N: 3 },
      { _id: 1057, arr_id: 25, lon: -15.874619, lat: 14.881638, O: 3, C: 3, E: 1, A: 2, N: 2 },
      { _id: 1064, arr_id: 43, lon: -15.890737, lat: 15.437113, O: 3, C: 2, E: 1, A: 1, N: 3 },
      { _id: 1071, arr_id: 46, lon: -15.865722, lat: 15.029319, O: 1, C: 3, E: 3, A: 1, N: 1 },
      { _id: 1078, arr_id: 51, lon: -15.860098, lat: 14.292511, O: 2, C: 2, E: 1, A: 3, N: 2 },
      { _id: 1085, arr_id: 85, lon: -15.817624, lat: 12.696291, O: 2, C: 1, E: 2, A: 1, N: 1 },
      { _id: 1092, arr_id: 70, lon: -15.797531, lat: 16.487832, O: 1, C: 2, E: 2, A: 2, N: 3 },
      { _id: 1099, arr_id: 24, lon: -15.742851, lat: 14.76672, O: 1, C: 1, E: 3, A: 2, N: 1 },
      { _id: 1106, arr_id: 90, lon: -15.747063, lat: 13.31357, O: 2, C: 3, E: 2, A: 3, N: 2 },
      { _id: 1113, arr_id: 62, lon: -15.750715, lat: 14.222361, O: 2, C: 2, E: 2, A: 3, N: 3 },
      { _id: 1120, arr_id: 31, lon: -15.672044, lat: 14.610167, O: 1, C: 2, E: 3, A: 2, N: 2 },
      { _id: 1127, arr_id: 68, lon: -15.655296, lat: 16.23845, O: 1, C: 2, E: 1, A: 1, N: 3 },
      { _id: 1134, arr_id: 47, lon: -15.718106, lat: 15.17387, O: 1, C: 2, E: 1, A: 1, N: 2 },
      { _id: 1141, arr_id: 68, lon: -15.6159, lat: 16.154193, O: 1, C: 2, E: 1, A: 3, N: 1 },
      { _id: 1148, arr_id: 86, lon: -15.63583, lat: 13.081199, O: 1, C: 1, E: 1, A: 2, N: 2 },
      { _id: 1155, arr_id: 90, lon: -15.584321, lat: 13.216073, O: 1, C: 3, E: 1, A: 3, N: 2 },
      { _id: 1162, arr_id: 84, lon: -15.569035, lat: 12.501114, O: 2, C: 1, E: 2, A: 2, N: 2 },
      { _id: 1169, arr_id: 59, lon: -15.552857, lat: 14.116868, O: 2, C: 2, E: 2, A: 3, N: 3 },
      { _id: 1176, arr_id: 48, lon: -15.603574, lat: 15.574339, O: 1, C: 2, E: 3, A: 3, N: 2 },
      { _id: 1183, arr_id: 48, lon: -15.51232, lat: 15.788272, O: 1, C: 1, E: 2, A: 2, N: 2 },
      { _id: 1190, arr_id: 86, lon: -15.5005, lat: 13.074109, O: 3, C: 3, E: 3, A: 2, N: 1 },
      { _id: 1197, arr_id: 23, lon: -15.467996, lat: 14.834308, O: 2, C: 3, E: 2, A: 2, N: 1 },
      { _id: 1204, arr_id: 61, lon: -15.457109, lat: 13.809627, O: 1, C: 2, E: 1, A: 2, N: 3 },
      { _id: 1211, arr_id: 59, lon: -15.397428, lat: 14.369432, O: 1, C: 2, E: 1, A: 2, N: 1 },
      { _id: 1218, arr_id: 50, lon: -15.327509, lat: 14.724259, O: 1, C: 2, E: 1, A: 2, N: 3 },
      { _id: 1225, arr_id: 48, lon: -15.298706, lat: 15.475747, O: 3, C: 2, E: 3, A: 2, N: 2 },
      { _id: 1232, arr_id: 89, lon: -15.226366, lat: 12.826538, O: 2, C: 2, E: 1, A: 3, N: 3 },
      { _id: 1239, arr_id: 63, lon: -15.216901, lat: 14.133805, O: 1, C: 1, E: 2, A: 3, N: 2 },
      { _id: 1246, arr_id: 61, lon: -15.146954, lat: 13.839146, O: 3, C: 2, E: 1, A: 3, N: 3 },
      { _id: 1253, arr_id: 49, lon: -15.122529, lat: 15.413477, O: 1, C: 3, E: 2, A: 3, N: 2 },
      { _id: 1260, arr_id: 83, lon: -15.085447, lat: 13.003342, O: 3, C: 3, E: 2, A: 2, N: 3 },
      { _id: 1267, arr_id: 74, lon: -15.007387, lat: 16.455714, O: 1, C: 2, E: 2, A: 1, N: 3 },
      { _id: 1274, arr_id: 83, lon: -14.962428, lat: 12.893312, O: 2, C: 2, E: 1, A: 2, N: 1 },
      { _id: 1281, arr_id: 83, lon: -14.936854, lat: 12.866183, O: 2, C: 1, E: 3, A: 3, N: 1 },
      { _id: 1288, arr_id: 83, lon: -14.911586, lat: 12.901244, O: 2, C: 3, E: 1, A: 2, N: 2 },
      { _id: 1295, arr_id: 65, lon: -14.885906, lat: 14.210753, O: 2, C: 1, E: 3, A: 2, N: 2 },
      { _id: 1302, arr_id: 71, lon: -14.868726, lat: 16.54191, O: 3, C: 3, E: 2, A: 1, N: 2 },
      { _id: 1309, arr_id: 49, lon: -14.835915, lat: 15.780375, O: 2, C: 2, E: 3, A: 2, N: 1 },
      { _id: 1316, arr_id: 71, lon: -14.781162, lat: 15.97489, O: 3, C: 1, E: 1, A: 3, N: 2 },
      { _id: 1323, arr_id: 66, lon: -14.730567, lat: 14.458062, O: 2, C: 1, E: 1, A: 2, N: 3 },
      { _id: 1330, arr_id: 66, lon: -14.714563, lat: 14.392167, O: 2, C: 2, E: 3, A: 3, N: 3 },
      { _id: 1337, arr_id: 66, lon: -14.590426, lat: 14.238272, O: 2, C: 2, E: 2, A: 1, N: 3 },
      { _id: 1344, arr_id: 121, lon: -14.539664, lat: 14.672852, O: 1, C: 2, E: 3, A: 3, N: 2 },
      { _id: 1351, arr_id: 110, lon: -14.536624, lat: 14.509138, O: 1, C: 3, E: 3, A: 2, N: 1 },
      { _id: 1358, arr_id: 121, lon: -14.490594, lat: 15.291617, O: 1, C: 3, E: 1, A: 3, N: 3 },
      { _id: 1365, arr_id: 121, lon: -14.413038, lat: 14.868911, O: 3, C: 2, E: 3, A: 2, N: 3 },
      { _id: 1372, arr_id: 110, lon: -14.345161, lat: 14.082164, O: 1, C: 1, E: 2, A: 3, N: 1 },
      { _id: 1379, arr_id: 109, lon: -14.284077, lat: 13.4937, O: 3, C: 2, E: 3, A: 1, N: 3 },
      { _id: 1386, arr_id: 82, lon: -14.291432, lat: 12.740522, O: 2, C: 2, E: 2, A: 2, N: 3 },
      { _id: 1393, arr_id: 110, lon: -14.188116, lat: 13.826914, O: 3, C: 2, E: 1, A: 3, N: 2 },
      { _id: 1400, arr_id: 72, lon: -14.147741, lat: 16.46415, O: 3, C: 1, E: 1, A: 2, N: 2 },
      { _id: 1407, arr_id: 81, lon: -14.121799, lat: 13.124353, O: 3, C: 1, E: 1, A: 2, N: 2 },
      { _id: 1414, arr_id: 81, lon: -14.072379, lat: 13.211558, O: 2, C: 3, E: 2, A: 2, N: 2 },
      { _id: 1421, arr_id: 69, lon: -13.971636, lat: 16.03789, O: 1, C: 2, E: 2, A: 2, N: 3 },
      { _id: 1428, arr_id: 69, lon: -13.950205, lat: 16.128486, O: 2, C: 2, E: 2, A: 3, N: 3 },
      { _id: 1435, arr_id: 69, lon: -13.921097, lat: 16.173391, O: 1, C: 2, E: 2, A: 2, N: 3 },
      { _id: 1442, arr_id: 78, lon: -13.793907, lat: 13.328115, O: 2, C: 2, E: 3, A: 3, N: 3 },
      { _id: 1449, arr_id: 108, lon: -13.803372, lat: 13.657528, O: 2, C: 2, E: 2, A: 3, N: 3 },
      { _id: 1456, arr_id: 108, lon: -13.700629, lat: 13.495144, O: 2, C: 3, E: 3, A: 1, N: 1 },
      { _id: 1463, arr_id: 121, lon: -13.537251, lat: 15.131791, O: 3, C: 1, E: 2, A: 1, N: 2 },
      { _id: 1470, arr_id: 107, lon: -13.664964, lat: 13.749933, O: 2, C: 3, E: 1, A: 2, N: 2 },
      { _id: 1477, arr_id: 107, lon: -13.638731, lat: 13.765562, O: 3, C: 2, E: 3, A: 1, N: 1 },
      { _id: 1484, arr_id: 120, lon: -13.587863, lat: 15.944074, O: 3, C: 2, E: 3, A: 1, N: 3 },
      { _id: 1491, arr_id: 108, lon: -13.597287, lat: 13.396582, O: 3, C: 2, E: 3, A: 1, N: 2 },
      { _id: 1498, arr_id: 119, lon: -13.479531, lat: 15.86097, O: 3, C: 1, E: 3, A: 2, N: 1 },
      { _id: 1505, arr_id: 119, lon: -13.412139, lat: 15.842742, O: 2, C: 3, E: 1, A: 3, N: 2 },
      { _id: 1512, arr_id: 119, lon: -13.378187, lat: 15.645574, O: 2, C: 2, E: 3, A: 2, N: 1 },
      { _id: 1519, arr_id: 119, lon: -13.300723, lat: 15.592517, O: 2, C: 2, E: 2, A: 2, N: 2 },
      { _id: 1526, arr_id: 119, lon: -13.262125, lat: 15.656074, O: 3, C: 2, E: 2, A: 1, N: 3 },
      { _id: 1533, arr_id: 123, lon: -13.152186, lat: 15.383234, O: 2, C: 3, E: 2, A: 2, N: 2 },
      { _id: 1540, arr_id: 104, lon: -13.009595, lat: 12.794341, O: 3, C: 2, E: 1, A: 2, N: 2 },
      { _id: 1547, arr_id: 122, lon: -12.973684, lat: 14.903241, O: 2, C: 3, E: 3, A: 2, N: 2 },
      { _id: 1554, arr_id: 122, lon: -12.862836, lat: 15.27057, O: 1, C: 2, E: 2, A: 1, N: 3 },
      { _id: 1561, arr_id: 104, lon: -12.792752, lat: 12.738735, O: 3, C: 1, E: 3, A: 3, N: 2 },
      { _id: 1568, arr_id: 122, lon: -12.768781, lat: 15.049946, O: 1, C: 3, E: 1, A: 3, N: 2 },
      { _id: 1575, arr_id: 115, lon: -12.706972, lat: 14.029333, O: 3, C: 3, E: 2, A: 3, N: 3 },
      { _id: 1582, arr_id: 115, lon: -12.588186, lat: 14.204064, O: 2, C: 1, E: 2, A: 2, N: 2 },
      { _id: 1589, arr_id: 101, lon: -12.468263, lat: 12.96314, O: 3, C: 2, E: 3, A: 2, N: 3 },
      { _id: 1596, arr_id: 116, lon: -12.454864, lat: 14.90336, O: 3, C: 1, E: 1, A: 3, N: 1 },
      { _id: 1603, arr_id: 101, lon: -12.46467, lat: 12.666298, O: 3, C: 3, E: 2, A: 1, N: 1 },
      { _id: 1610, arr_id: 101, lon: -12.382105, lat: 12.950737, O: 2, C: 3, E: 2, A: 3, N: 2 },
      { _id: 1617, arr_id: 101, lon: -12.268307, lat: 12.785797, O: 1, C: 2, E: 1, A: 3, N: 1 },
      { _id: 1624, arr_id: 101, lon: -12.269924, lat: 12.549737, O: 1, C: 1, E: 1, A: 3, N: 1 },
      { _id: 1631, arr_id: 101, lon: -12.206622, lat: 12.558402, O: 3, C: 2, E: 1, A: 2, N: 2 },
      { _id: 1638, arr_id: 106, lon: -12.140142, lat: 13.243135, O: 3, C: 2, E: 3, A: 3, N: 3 },
      { _id: 1645, arr_id: 105, lon: -11.878992, lat: 12.469844, O: 2, C: 3, E: 1, A: 3, N: 1 },
      { _id: 1652, arr_id: 102, lon: -11.661564, lat: 12.487834, O: 2, C: 2, E: 2, A: 1, N: 1 },
      { _id: 1659, arr_id: 102, lon: -11.534809, lat: 12.476925, O: 3, C: 3, E: 3, A: 2, N: 2 },
      { _id: 1666, arr_id: 102, lon: -11.373306, lat: 12.46543, O: 3, C: 3, E: 3, A: 2, N: 2 },
    ]
  }
}


