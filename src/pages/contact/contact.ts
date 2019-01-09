import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IBeacon } from '@ionic-native/ibeacon';
import { CalculatorProvider } from '../../providers/calculator/calculator';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  delegate: any;
  regions = [
    this.iBeacon.BeaconRegion('beacon1', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 1, 1),
    this.iBeacon.BeaconRegion('beacon2', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 2, 1),
    this.iBeacon.BeaconRegion('beacon3', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 3, 1),
    this.iBeacon.BeaconRegion('beacon4', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 4, 1)
  ]

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private iBeacon: IBeacon, private calculator: CalculatorProvider) {
    this.delegate = this.iBeacon.Delegate();

    let delegate = this.iBeacon.Delegate();

    this.startMonitoringForAllRegions();
  }

  startMonitoringForAllRegions() {
    for (var region of this.regions) {
      console.log(region);
      this.iBeacon.startMonitoringForRegion(region)
        .then(
        () => console.log('Native layer recieved the request to monitoring'),
        error => console.error('Native layer failed to begin monitoring: ', error)
        );
    }
  }

  presentErrorAlert(text) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: text,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentSuccessAlert(text) {
    let alert = this.alertCtrl.create({
      title: 'Success',
      subTitle: text,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  handleBeaconDiscovered(region) {
    // 1st found beacon
    console.log("found beacon");
    console.log(region);

  }

}
