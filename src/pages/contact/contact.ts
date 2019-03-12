import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { IBeacon, IBeaconPluginResult } from "@ionic-native/ibeacon"; //Braucht man IBeaconPluginResult? Und Region?
import { TextToSpeech } from "@ionic-native/text-to-speech";
/*
import {
  CalculatorBeacon,
  DistanceCalculator
} from "../../providers/calculator/calculator";
*/
@Component({
  selector: "page-contact",
  templateUrl: "contact.html"
})
export class ContactPage {
  log: StringConstructor;
  //foundBeacons: CalculatorBeacon[];
  foundRegions: any[] = [];

  regions = [
    this.iBeacon.BeaconRegion('beacon1', 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0', 1, 1),
    this.iBeacon.BeaconRegion('beacon2', 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0', 2, 1),
    this.iBeacon.BeaconRegion('beacon3', 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0', 3, 1),
    this.iBeacon.BeaconRegion('beacon4', 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0', 4, 1)
    //Deklaration der BeaconRegion
    //this.iBeacon.BeaconRegion('beacon1', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 1, 1),
    /*
    this.iBeacon.BeaconRegion(
      "beacon2",
      "B9407F30-F5F8-466E-AFF9-25556B57FE6D",
      2,
      1
    ),
    this.iBeacon.BeaconRegion(
      "beacon3",
      "B9407F30-F5F8-466E-AFF9-25556B57FE6D",
      3,
      1
    ),
    this.iBeacon.BeaconRegion(
      "beacon4",
      "B9407F30-F5F8-466E-AFF9-25556B57FE6D",
      4,
      1
    )
    */
  ];

  //Wofür sind private alertCtrl: AlertController und private htmlCtrl: HTMLController ? Scheinen nutzlos zu sein.
  //Wozu private calculator: CalculatorProvider? Viel einfacher und schöner: calculate als static-Methode.
  constructor(
    public navCtrl: NavController,
    private tts: TextToSpeech,
    private iBeacon: IBeacon
  ) {
    let delegate = this.iBeacon.Delegate();

    // Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion().subscribe(data => {
      //console.log("didRangeBeaconsInRegion: ", data);
    });
    delegate.didStartMonitoringForRegion().subscribe(data => {
      //console.log("didStartMonitoringForRegion: ", data);
    });
    delegate.didEnterRegion().subscribe(data => {
      console.log("didEnterRegion: ", data);
      this.handleBeaconDiscovered(data);
    });
    delegate.didExitRegion().subscribe(data => {
      console.log("didExitRegion: ", data);
    });
    this.startMonitoringForAllRegions();
  }

  startMonitoringForAllRegions() {
    for (var region of this.regions) {
      console.log(region);
      this.iBeacon
        .startMonitoringForRegion(region)
        .then(
          () =>
          console.log("Native layer recieved the request to monitoring"),
          error =>
          console.log("Native layer failed to begin monitoring: ", error)
        );
    }
  }

  handleBeaconDiscovered(region) {
    // 1st found beacon
    console.log("found beacon");
    console.log(region);
    if (this.foundRegions.length == 0) {
      this.foundRegions.push(region.region);
    } else {
      // 2nd - 4th found beacon
      var beaconAlreadyFound = false;
      console.log("checking if beacon was found already", region);
      for (var i = 0; i < this.foundRegions.length; i++) {
        var foundRegion = this.foundRegions[i];
        console.log("found region " + (i + 1) + ": ", foundRegion);
        if (
          foundRegion.uuid == region.region.uuid &&
          foundRegion.major == region.region.major &&
          foundRegion.minor == region.region.minor
        ) {
          console.log("beacon already found");
          beaconAlreadyFound = true;
          break;
        }
      }
      if (!beaconAlreadyFound) {
        console.log(region);
        console.log("found a new answer beacon");
        this.foundRegions.push(region.region);
        console.log("founds regions: ", this.foundRegions);
      }


      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //Wenn 3 Beacons gefunden werden, werden alle 3 in der CONSOLE ausgegeben, danach kann die Berechnung beginnen                        !
      //Bei mir geht der Calculator provider immernoch nicht, da immernoch jquery benutzt wird und bei mir nur Fehler kommen                !
      //Ebenso musste ich alle this.apply und this.logs entfernen... Ich weiß nicht was das macht oder soll aber es gibt mir nur errors,    !
      //da es relativ schwer ist auf ein Page Object logs auszuführen                                                                       !
      //Bitte an diesem Cde nichts ändern, nur unten die calculate Methode aufrufen und die BEACONS innerhalb der Regions übergeben und     !
      //die Beacons daraus bzw. die Daten die ihr braucht                                                                                   !
      //im Calculator zusammenschustern wie auch immer.                                                                                     !
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


      if (this.foundRegions.length >= 3) {
        for (var i = 0; i < this.foundRegions.length; i++) {
          console.log("founds Beacon Nr.: " + i, this.foundRegions[i]);
        }
        //var answers = DistanceCalculator.calculate(this.foundBeacons);
        var answer =
          "Die Position ist: " +
          //answers[0].toString() +
          " oder " +
          //answers[1].toString();

        //Position ausgeben
        this.speak(answer);
        console.log(answer);
      }
    }
  }

  speak(answer: string) {
    this.tts
      .speak(answer)
      .then(() => console.log("Success"))
      .catch((reason: any) => console.log(reason));
  }
  //Wurde nie aufgerufen so kann nichts gefunden werden oder passieren...
  /*
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

  
  */
}
