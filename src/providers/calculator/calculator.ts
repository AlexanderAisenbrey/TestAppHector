
import { Injectable } from '@angular/core';

/*
  Generated class for the CalculatorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CalculatorProvider {

  constructor() {
    console.log('Hello CalculatorProvider Provider');
  }

  calculate(response){
    return "In 3 Metern geht es steil bergab, bitte sofort stehen bleiben!"
  }

}
