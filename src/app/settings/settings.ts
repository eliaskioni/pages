/**
 * Created by kioni on 5/17/16.
 */

import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from "@angular/router";
import {BackendApis} from "../services/backend.apis";

@Component({
    templateUrl: './settings.html',
    styleUrls: ['/settings.css',
        './sb-admin.css',
        './morris.css',],
    encapsulation: ViewEncapsulation.None,



})


export class Settings {
  balance: any;

  constructor(public backendApi: BackendApis, private router: Router) {
    this.backendApi.check_balance()
      .subscribe(
        response => {
          this.balance =response.text();
        },
         error => {
          this.balance = 'Error has occurred'
         }
      )
  }

  dashboard() {
        this.router.navigate(['/home/dashboard']);
    }
}
