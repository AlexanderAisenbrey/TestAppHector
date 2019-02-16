import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IBeacon, IBeaconPluginResult } from '@ionic-native/ibeacon'; //Braucht man IBeaconPluginResult? Und Region?
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { CalculatorBeacon, DistanceCalculator } from '../../providers/calculator/calculator';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})

export class ContactPage {
  log:StringConstructor;
  foundBeacons:CalculatorBeacon[];
  foundRegions:IBeaconPluginResult[];

  regions = [ //Deklaration der BeaconRegion
    //this.iBeacon.BeaconRegion('beacon1', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 1, 1),
    this.iBeacon.BeaconRegion('beacon2', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 2, 1),
    this.iBeacon.BeaconRegion('beacon3', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 3, 1),
    this.iBeacon.BeaconRegion('beacon4', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 4, 1)
  ]

  //Wofür sind private alertCtrl: AlertController und private htmlCtrl: HTMLController ? Scheinen nutzlos zu sein.
  //Wozu private calculator: CalculatorProvider? Viel einfacher und schöner: calculate als static-Methode.
  constructor(public navCtrl: NavController, private tts: TextToSpeech, private iBeacon: IBeacon) {

    let delegate = this.iBeacon.Delegate();
    
    this.log.apply("Test Fabian");
    // Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion()
      .subscribe( data => { this.log.apply('didRangeBeaconsInRegion: ', data) });
    delegate.didStartMonitoringForRegion()
      .subscribe( data => { this.log.apply('didStartMonitoringForRegion: ', data) });
    delegate.didEnterRegion()
      .subscribe( data => { this.log.apply('didEnterRegion: ', data) });
    delegate.didExitRegion()
      .subscribe( data => { this.log.apply('didExitRegion: ', data) });
    this.startMonitoringForAllRegions();
  }

  startMonitoringForAllRegions() {
    for (var region of this.regions) {
      this.log.apply(region);
      this.iBeacon.startMonitoringForRegion(region)
        .then(
          () => this.log.apply('Native layer recieved the request to monitoring'),
          error => this.log.apply('Native layer failed to begin monitoring: ', error)
        );
    }
  }

  handleRegionDiscovered(region: IBeaconPluginResult) {
    console.log("found region");
    console.log(region);
    
    //aktuelle Region zu Regionen hinzufügen    
    this.foundRegions.push(region);
    
    //Beacons aus Regionen in CalculatorBeacons
    this.foundBeacons = [];
    for(let i = 0; i < this.foundRegions.length; i++)
      for(let j = 0; j < this.foundRegions[i].beacons.length; j++){
        let pB = this.foundRegions[i].beacons[j];
        this.foundBeacons.push(new CalculatorBeacon(pB.uuid, pB.major, pB.minor, Number.NaN,Number.NaN,Number.NaN, pB.rssi, pB.tx));
      }

    //Position berechnen
    var answers = DistanceCalculator.calculate(this.foundBeacons);
    var answer = "Die Position ist: " + answers[0].toString() + " oder " + answers[1].toString();

    //Position ausgeben
    this.speak(answer);
    console.log(answer);
  }

  speak(answer: string) {
    this.tts.speak(answer)
      .then(() => console.log('Success'))
      .catch((reason: any) => console.log(reason));
  }
}

