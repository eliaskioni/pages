import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {Homepage} from "./homepage/homepage";
import {Login} from "./login/login";

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    providers: [Login, Homepage]

})
export class AppComponent {
    constructor(public router: Router) {

    }
}
