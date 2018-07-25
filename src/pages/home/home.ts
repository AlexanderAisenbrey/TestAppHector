import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  hours:number;
  minutes:number;
  seconds:number;

  constructor(public navCtrl: NavController) {

    this.hours = new Date().getHours();
    this.minutes = new Date().getMinutes();
    this.seconds = new Date().getSeconds();

    this.getTheTime();
  }

  getTheTime(){
    this.hours = new Date().getHours();
    this.minutes = new Date().getMinutes();
    this.seconds = new Date().getSeconds();

    setTimeout(()=>{
      this.getTheTime();
    },1000);
  }
}
