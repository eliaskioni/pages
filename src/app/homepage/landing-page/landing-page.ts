/**
 * Created by marlyn on 4/20/16.
 */
import {Component} from '@angular/core';
import {ContactUsComponent} from "../contact-us/contact-us";
import {HowToComponent} from "../how-to/how-to";
import {BackendApis} from "../../services/backend.apis";

@Component({
    selector: 'langing-page',
    templateUrl: './landing-page.html',
    styleUrls: ['./landing-page.css',],
})

export class LandingPageComponent{
    constructor(public backendApis: BackendApis) {

    }
}
