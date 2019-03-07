import { Component } from '@angular/core';
import { NavController, Loading } from 'ionic-angular';
import { IBeacon, IBeaconPluginResult } from '@ionic-native/ibeacon';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { CalculatorBeacon, DistanceCalculator } from '../../providers/calculator/calculator';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})

export class ContactPage {
  log1: String = "";
  log2: String = "";
  foundBeacons: CalculatorBeacon[] = [];
  foundRegions: IBeaconPluginResult[] = [];

  regions = [ // Deklaration der BeaconRegion
    //this.iBeacon.BeaconRegion('beacon1', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 1, 1),
    this.iBeacon.BeaconRegion('beacon2', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 2, 1),
    this.iBeacon.BeaconRegion('beacon3', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 3, 1),
    this.iBeacon.BeaconRegion('beacon4', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 4, 1)
  ]

  // Wofür sind private alertCtrl: AlertController und private htmlCtrl: HTMLController ? Scheinen nutzlos zu sein.
  // Wozu private calculator: CalculatorProvider? Viel einfacher und schöner: calculate als static-Methode.
  constructor(public navCtrl: NavController, private tts: TextToSpeech, private iBeacon: IBeacon) {
    // this.loga("1");
    let delegate = this.iBeacon.Delegate();

    // Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion()
      .subscribe(data => { this.log('didRangeBeaconsInRegion:') });
    delegate.didStartMonitoringForRegion()
       .subscribe(data => { this.loga(""); });
    delegate.didEnterRegion()
      .subscribe(data => { this.loga('\nA'); this.handleRegionDiscovered(data) });
    delegate.didExitRegion()
      .subscribe(data => { this.log('Z') });
    this.startMonitoringForAllRegions();
    // this.loga("4");
  }

  startMonitoringForAllRegions() {
    // this.loga("2");
    for (var region of this.regions) {
      //this.log(region.uuid);
      this.iBeacon.startMonitoringForRegion(region)
        // .then(() => this.loga("6"));
    }
    // this.loga("3");
  }

  handleRegionDiscovered(region: IBeaconPluginResult) {
    this.loga("B");
    // aktuelle Region zu Regionen hinzufügen    
    this.foundRegions.push(region);
    this.loga("C");
    // Beacons aus Regionen in CalculatorBeacons
    this.foundBeacons = [];
    for (let i = 0; i < this.foundRegions.length; i++) {
      this.loga(this.foundRegions.length.toString());
      this.loga("x" + this.foundRegions[i].toString() + "x");
      for (let j = 0; j < this.foundRegions[i].beacons.length; j++) {
        this.loga("D");
        //  let pB = this.foundRegions[i].beacons[j];
        //     this.foundBeacons.push(new CalculatorBeacon(pB.uuid, pB.major, pB.minor, Number.NaN,Number.NaN,Number.NaN, pB.rssi, pB.tx));
      }
    }
    //this.logb("NoBeacons: " + this.foundBeacons.length.toString())
    // Position berechnen
    //var answers = DistanceCalculator.calculate(this.foundBeacons);
    //var answer = "Die Position ist: " + answers[0].toString() + " oder " + answers[1].toString();

    //Position ausgeben
    //this.speak(answer);
    this.loga("D");
  }

  speak(answer: string) {
    this.tts.speak(answer)
      .then(() => this.logb("Success"))
      .catch((reason: any) => console.log(reason));
  }

  log(logtext: string) {
    this.log1 += logtext + "\n";
  }

  loga(logtext: string) {
    this.log1 += logtext + " ";
  }
  logb(logtext: string) {
    this.log1 += logtext + "\n";
    this.log2 += logtext + "\n";
  }
}

