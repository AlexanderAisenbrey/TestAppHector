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


    //An dieser Stelle werden die Beacons gefunden und hier muss der restliche Code geschrieben werden,
    //der dann festlegt was passieren soll wenn ein Beacons bzw. mehrere gefunden werden.
    //Prüfen, ob die richtige UUID der Beacons in den Regions regisitriert ist! Da ich andere Beacons hier habe zum testen
    }
    //Position Berechnen
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
