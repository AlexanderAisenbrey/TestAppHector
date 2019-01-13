import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

//  Generated class for the HttpProvider provider.
//
//  See https://angular.io/guide/dependency-injection for more info on providers
//  and Angular DI.

@Injectable()
export class HttpProvider {

  webservice: any = "http://185.101.94.223/"; //"https://euerwebservice/";

  constructor(public http: Http) {
    console.log('Hello HttpProvider Provider');
  }

  getPositions(regions){

    let headers = new Headers();
    let data = {
      regions: regions
    };
    headers.append('Content-Type', 'application/json');

    let options = new RequestOptions({
      headers: headers,
      body: JSON.stringify(data)
    });

    return this.http.post(this.webservice + "getPosition", data, options);
  }

  getHardcodedPositions(){
    return [123,456,789];
  }

}
