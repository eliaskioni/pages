/**
 * Created by kioni on 8/30/16.
 */

import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AboutUs} from "./aboutUs/About";
import {ContactUsComponent} from "./contact-us/contact-us";
import {FAQComponent} from "./faq/faq";
import {HowToComponent} from "./how-to/how-to";
import {LandingPageComponent} from "./landing-page/landing-page";
import {PricingComponent} from "./pricing/pricing";
import {WhyUsComponent} from "./why-us/why-us";
import {Homepage} from "./homepage";
import {Login} from "../login/login";
import {SignUpComponent} from "../signup/sign-up/signup";
import {TermsAndConditionsComponent} from "../terms_and_conditions/terms_and_conditions";
import {Reset} from "../passwords_reset/password_reset_confirm";

export const homepageRouter: Routes = [
  {path: 'homepage', component: Homepage,
  children: [
     { path: 'about_us',  component: AboutUs },
     { path: 'contact_us', component: ContactUsComponent },
     { path: 'faq', component: FAQComponent},
     { path: 'how_to', component: HowToComponent},
     { path: 'pricing', component: PricingComponent},
     { path: 'why_us', component: WhyUsComponent},
     { path: 'welcome', component: LandingPageComponent},
      { path: 'login', component: Login},
    { path: 'sign-up', component: SignUpComponent},
    { path: 'terms_and_condition', component: TermsAndConditionsComponent},
  ]},
  { path: '', redirectTo: '/homepage/welcome', pathMatch: 'full' },
    {path: 'accounts/reset/:user/:token', component: Reset }
];



export const homepageProviders: any[] = [];
export const homepageRoutes: ModuleWithProviders = RouterModule.forChild(homepageRouter);

