import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {IBeacon} from '@ionic-native/ibeacon';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  delegate:any;
regions = [
    this.ibeacon.BeaconRegion('beacon1', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 1, 1),
    this.ibeacon.BeaconRegion('beacon2', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 2, 1),
    this.ibeacon.BeaconRegion('beacon3', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 3, 1),
    this.ibeacon.BeaconRegion('beacon4', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 4, 1)
  ]

  constructor(public navCtrl: NavController, private iBeacon: IBeacon) {
    this.delegate = this.iBeacon.Delegate();
    this.didStartMonitoringForRegion();
  }

requestAlwaysAuthorization(){
this.iBeacon.requestAlwaysAuthorization();
}

startRangingBeaconsInRegion(region){
this.delegate.didRangeBeaconsInRegion()
  .subscribe(
    data => console.log('didRangeBeaconsInRegion: ', data),
    error => console.error()
  );
}

didStartMonitoringForRegion(){
this.delegate.didStartMonitoringForRegion()
  .subscribe(
    data => console.log('didStartMonitoringForRegion: ', data),
    error => console.error()
  );
}

didEnterRegion(){
this.delegate.didEnterRegion()
  .subscribe(
    data => {
      console.log('didEnterRegion: ', data);
    }
  );
}


}

