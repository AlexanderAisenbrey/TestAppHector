
import { Injectable } from '@angular/core';

/*
  Generated class for the CalculatorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export class DistanceCalculator {

    static calculate(beaconNames: Beacon[], distances: number[]) {
        if (beaconNames.length < 3) //Calculations need three beacons for beeing in a three-dimensional space.
            return 1;

        var allBeacons = this.getAllBeaconData("http://185.101.94.223/");
        var indeces;
        for (var i = 0; i < beaconNames.length; i++){
            var index = allBeacons.findIndex((x => x.UUID == beaconNames[i].UUID && x.Major == beaconNames[i].Major && x.Minor == beaconNames[i].Minor));
            if(index != -1) //if no index found: remove this index from list of found beacons
                indeces[i] = index;
            else{
                beaconNames.splice(i,1);
                i--;
            }
        }
        
        if (beaconNames.length < 3) //Calculations need three beacons for beeing in a three-dimensional space.
            return 1;

        while (beaconNames.length > 3){ //Remove beacons with greatest distance until three remaining
            var maximum = distances[0];
            var maximumIndex = 0;
            for(i = 1; i < distances.length; i++)
                if(distances[i] > maximum){
                    maximum = distances[i];
                    maximumIndex = i;
                }
            distances.splice(maximumIndex,1);
        }

        var beaconPositions : Vector[];
        for (i = 0; i < beaconNames.length; i++)
            beaconPositions[i] = allBeacons[indeces[i]].positionToVector();


        this.calculatePoints(beaconPositions, distances);
    }
    
    static test() {
        //Hardgecodete Probewerte
        var p = [
            new Vector(0, 0, 0),
            new Vector(1.5, 0.5, 1),
            new Vector(1.5, -0.6, 0.7)];
        var r = [1.7, 1.1, 1.7];

        return this.calculatePoints(p, r);
    }

    static getAllBeaconData(URL: string) {
        var lines = $.get(URL).responseText.split('\n'); //Lines of HTML of our website
       
        var b; //Beacons: UUID | Major | Minor | Length | Width | Altitude
        var i = 0, row = 0, col = 0;

        while (lines[i].length < 4 || lines[i].substr(0, 4) != "<td>") { i++ }
        while (lines[i].length < 8 || lines[i].substr(0, 8) != "</table>") {
            b[row] = new Array(6);
            while (lines[i].substr(0, 5) != "</tr>") {
                b[row][col] = lines[i].substr(5, lines[i].length - 5);
                col++;
                i++;
            }
            i++;
            while (lines[i].length < 4 || lines[i].substr(0, 4) != "<tr>") { i++ }
            i++;
            col = 0;
            row++;
        }
        
        var beacons = new Array(b.length);
        for (var j = 0; j < b.length; j++)
            beacons[j] = new Beacon(b[j][0], b[j][1], b[j][2], b[j][3], b[j][4], b[j][5]);
        return beacons;
    }

    //NOT TO BE USED FROM OUTSIDE! ##########################################################################################################################################
    static calculatePoints(p: Vector[], r: number[]) {
        var absAB, beta, h_1, s_1, t_1;
        var absAC, gamma, h_2, s_2, t_2;

        var v = new Vector(0, 0, 0);
        var M_1 = new Vector(0, 0, 0);
        var M_2 = new Vector(0, 0, 0);

        var U = new Vector(0, 0, 0);
        var res = [new Vector(0, 0, 0), new Vector(0, 0, 0)];

        //TODO: AUsschließen, dass sie sich nicht schneiden

        //A auf Ursprung, einfachere Berechnungen
        p[1] = this.VAdd(p[1], this.VStr(-1, p[0]));
        p[2] = this.VAdd(p[2], this.VStr(-1, p[0]));

        //# Stützvektor berechnen
        //Vorrechnungen
        absAB = this.Vektorbetrag(p[1]);
        absAC = this.Vektorbetrag(p[2]);

        //Winkel am Äußeren Punkt berechnen, Cosinussatz
        beta = Math.acos((this.sq(r[1]) + this.sq(absAB) - this.sq(r[0])) / (2 * r[1] * absAB));
        gamma = Math.acos((this.sq(r[2]) + this.sq(absAC) - this.sq(r[0])) / (2 * r[2] * absAC));

        //Berechnungen an den Schnittkreisen der Kugeln
        //Berechnung der Höhen der Dreiecke, entspricht dem Radius des Kreises
        h_1 = Math.sin(beta) * r[1];
        h_2 = Math.sin(gamma) * r[2];

        //Berechnung der Distanz vom Äußeren Punkt (B bzw. C) zum Mittelpunkt des Schnittkreises
        s_1 = h_1 / Math.tan(beta);
        s_2 = h_2 / Math.tan(gamma);

        //Berechnung des Mittelpunktes des Schnittkreises
        M_1 = this.VStr(1 - s_1 / this.Vektorbetrag(p[1]), p[1]);
        M_2 = this.VStr(1 - s_2 / this.Vektorbetrag(p[2]), p[2]);

        //Berechnung eines Punktes auf der Schnittgeraden //TODO: Parallelität ausschließen, wenn Parallel zur yz-Ebene: y auf 0 setzen.
        U.z = (p[2].y * this.Ska(M_1, p[1]) - p[1].y * this.Ska(M_2, p[2])) / (p[2].y * p[1].z - p[1].y * p[2].z);
        U.y = (this.Ska(M_1, p[1]) - p[1].z * U.z) / p[1].y;
        U.x = 0;
        //=> Stützvektor berechnet

        //# Richtungsvektor berechnen
        v = this.Vektorprodukt(p[1], p[2]);

        // Schnittpunkte berechnen
        // Entfernung der SP von U berechnen
        this.QuadratischeGleichung(this.sq(v.x) + this.sq(v.y) + this.sq(v.z), 2 * this.Ska(U, v), this.sq(U.x) + this.sq(U.y) + this.sq(U.z) - this.sq(r[0]), t_1, t_2);

        // Schnittpunkte berechnen
        res[0] = this.VAdd(U, this.VStr(t_1, v));
        res[1] = this.VAdd(U, this.VStr(t_2, v));

        // Zurückverschiebung um A
        res[0] = this.VAdd(res[0], p[0]);
        res[1] = this.VAdd(res[1], p[0]);

        return res;
    }

    //Vektorstreckung: Skalar mal Vektor
    static VStr(a, b) { //double a, Vector b
        return new Vector(a * b.x, a * b.y, a * b.z);
    }

    //Vektoraddition: Vektor + Vektor
    static VAdd(a, b) { //Vector a, Vector b
        return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    //Skalarprodukt: Vektor * Vektor
    static Ska(a, b) { //Vector a, Vector b
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    //Vektorprodukt: Vektor kreuz Vektor
    static Vektorprodukt(a, b) { //Vector a, vector b
        return new Vector(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    }

    //Vektorbetrag: Betrag eines Vektors
    static Vektorbetrag(a) { //Vector a
        return Math.sqrt(this.sq(a.x) + this.sq(a.y) + this.sq(a.z));
    }

    //Lösung einer quadratischen Gleichung
    static QuadratischeGleichung(a, b, c, res1, res2) { //parameter a,b,c of QUADRATISCHE GLEICHUNG
        var root = Math.sqrt(this.sq(b) - 4 * a * c);
        res1 = (-b - root) / (2 * a);
        res2 = (-b + root) / (2 * a);
    }

    // a^2
    static sq(a) {
        return a * a;
    }
}

export class Vector {
    x = 0.0;
    y = 0.0;
    z = 0.0;

    constructor(x, y, z) { this.x = x; this.y = y; this.z = z; }

    writeString() { return "X: " + this.x + "Y: " + this.y + "Z: " + this.z }
}

export class Beacon {
    UUID: string;
    Major: string;
    Minor: string;
    Length: number;
    Width: number;
    Altitude: number;

    constructor(UUID: string, Major: string, Minor: string, Length: number, Width: number, Altitude: number) {
        this.UUID = UUID;
        this.Major = Major;
        this.Minor = Minor;
        this.Length = Length;
        this.Width = Width;
        this.Altitude = Altitude;
    }

    positionToVector(){
        return new Vector(this.Length, this.Width, this.Altitude);
    }
}