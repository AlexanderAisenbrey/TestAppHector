import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  longitude: number;
  latitude: number;
  altitude: number;
  speed: number;

  constructor(private geolocation: Geolocation, public navCtrl: NavController) {
    this.getThePosition();
  }
  getThePosition()  {
    this.geolocation.getCurrentPosition().then((resp) =>  {
      console.log("Start get Postition");
      this.longitude = Math.round(resp.coords.longitude*100)/100;
      this.latitude = Math.round(resp.coords.latitude*100)/100;
      this.altitude = Math.round(resp.coords.altitude*100)/100;
      this.speed = resp.coords.speed;
    }).catch((error) => {
      console.log("Error getting Location" , error);
    });
  }
}
