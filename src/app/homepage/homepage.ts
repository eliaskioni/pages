import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AboutUs} from './aboutUs/About';
import {LandingPageComponent} from "./landing-page/landing-page";
import {Login} from "../login/login";
import {SignUpFormComponent} from "../signup/sign-up-form";
import {HowToComponent} from "./how-to/how-to";
import {TermsAndConditionsComponent} from "../terms_and_conditions/terms_and_conditions";
import {WhyUsComponent} from "./why-us/why-us";
import {ContactUsComponent} from "./contact-us/contact-us";
import {PricingComponent} from "./pricing/pricing";
import {Reset} from "../passwords_reset/password_reset_confirm";
import {BackendApis} from "../services/backend.apis";
import {FAQComponent} from "./faq/faq";
import {Settings} from "../settings/settings";


@Component({
    selector: "homepage",
    templateUrl: "./homepage.html",
    styleUrls: [
        './home-page.css',
        './morris.css',
        './clients-style.css',
    ],
})
export class Homepage {
    constructor(public router:Router, public backendApis: BackendApis) {

    }

    logout(){
        localStorage.removeItem('jwt');
        this.router.navigate(["/homepage/welcome"])
    }
}
