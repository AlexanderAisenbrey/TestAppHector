import { HTTP } from '@ionic-native/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the CalculatorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CalculatorProvider {

  constructor(public http: HTTP) {
    console.log('Hello CalculatorProvider Provider');
  }

  calculate(){
    console.log("calculated");
  }

}
