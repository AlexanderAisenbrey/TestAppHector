import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IBeacon } from '@ionic-native/ibeacon';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Beacon, DistanceCalculator } from '../../providers/calculator/calculator';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  foundBeacons = [];
  delegate: any;
  //Deklaration der BeaconRegion
  regions = [
    this.iBeacon.BeaconRegion('beacon2', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 2, 1),
    this.iBeacon.BeaconRegion('beacon3', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 3, 1),
    this.iBeacon.BeaconRegion('beacon4', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 4, 1)
  ]

  //Wofür sind private alertCtrl: AlertController und private htmlCtrl: HTMLController ? Scheinen nutzlos zu sein.
  //Wozu private calculator: CalculatorProvider ? Viel einfacher und schöner: calculate als static-Methode.
  constructor(public navCtrl: NavController, private tts: TextToSpeech, private iBeacon: IBeacon) {

    let delegate = this.iBeacon.Delegate();

    // Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion()
      .subscribe(
        data => { console.log('didRangeBeaconsInRegion: ', data) },
        error => { console.error() }
      );
    delegate.didStartMonitoringForRegion()
      .subscribe(
        data => { console.log('didStartMonitoringForRegion: ', data) },
        error => { console.error() }
      );
    delegate.didEnterRegion()
      .subscribe(
        data => {
          console.log('didEnterRegion: ', data);
          this.handleRegionDiscovered(data);
        }
      );
    delegate.didExitRegion()
      .subscribe(
        data => {
          console.log('didExitRegion: ', data);
        }
      );
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

  handleRegionDiscovered(region) {
    console.log("found beacon: ",region);
    this.foundBeacons.push(region);

    //Wenn genug Beacons gefunden sind, dann die Position berechnen
    if (this.foundBeacons.length >= 3) {

      //Position Berechnen
      var beacons: Beacon[] = [new Beacon("HAHA", "1", "2", Number.NaN, Number.NaN, Number.NaN)]
      var distances: number[] = [1, 2, 3];
      var answer = DistanceCalculator.calculate(beacons, distances);

      //Position ausgeben
      this.speak(answer);
      console.log("Found Beacons"+this.foundBeacons);
    }
  }

  speak(answer) {
    this.tts.speak(answer)
      .then(() => console.log('Success'))
      .catch((reason: any) => console.log(reason));
  }
}
