/**
 * Created by marlyn on 4/20/16.
 */
import {Component} from '@angular/core';
// import {ANGULAR2_GOOGLE_MAPS_DIRECTIVES} from "angular2-google-maps/core";
// import {ANGULAR2_GOOGLE_MAPS_DIRECTIVES} from "angular2-google-maps/directives-const";
// import {ANGULAR2_GOOGLE_MAPS_PROVIDERS, MapsAPILoader, NoOpMapsAPILoader} from "angular2-google-maps/core";

@Component({
    selector: 'contact-us',
    templateUrl: './contact-us.html',
    styleUrls: [
        './contact-us.css'
    ],
})

export class ContactUsComponent{
    constructor(){

    }
    centerLat: Number = -1.299635;
    centerLng: Number = 36.7567002;
    lat: Number = -1.299635;
    lng: Number = 36.7567002;
}
