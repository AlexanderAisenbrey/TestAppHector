import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IBeacon } from '@ionic-native/ibeacon';
import { CalculatorProvider } from '../../providers/calculator/calculator';
import { HttpProvider } from '../../providers/http/http';
import { AlertController } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  foundRegions=[];
  delegate: any;
  regions = [
    this.iBeacon.BeaconRegion('beacon1', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 1, 1),
    this.iBeacon.BeaconRegion('beacon2', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 2, 1),
    this.iBeacon.BeaconRegion('beacon3', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 3, 1),
    this.iBeacon.BeaconRegion('beacon4', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 4, 1)
  ]

  constructor(private httpProvider:HttpProvider, public navCtrl: NavController,private tts: TextToSpeech, private alertCtrl: AlertController, private iBeacon: IBeacon, private calculator: CalculatorProvider) {

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
          this.handleBeaconDiscovered(data);
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

  handleBeaconDiscovered(region) {
    console.log("found beacon");
    console.log(region);
    //Wenn alle Bacons gefunden sind, dann die Positionswerte vom Webservice holen.
    this.foundRegions.push(region);

    //Mit Server
    /*
    this.httpProvider.getPositions(this.foundRegions).subscribe((response)=>{
      this.calculator.calculate(response);
    });
    */
    //Ohne Server
    let hcPositions = this.httpProvider.getHardcodedPositions();
      let answer = this.calculator.calculate(hcPositions);
    //Anschließend die Werte in den Triangluationsprovider/Calcular übergeben und Anschließend die Ergebnisse der Berechnung als Sprachausgabe ausgeben

    this.speak(answer);
    console.log("found beacon");
    console.log(region);

  }

  speak(answer){
    this.tts.speak(answer)
  .then(() => console.log('Success'))
  .catch((reason: any) => console.log(reason));
  }

}
