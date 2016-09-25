
import {Component, OnInit, ViewChild, Injectable, Inject, forwardRef, OnDestroy} from "@angular/core";
import {BackendApis} from "../../services/backend.apis";
import {RouterLink} from "@angular/router";
import {BillingPreLoader} from "../billing/billing-loader";
import {FormatDatePipe} from "../airtime/reports/date-pipe";
import {Observable} from "rxjs/Observable";
import {LoadingIndicator} from "../../loading_indicator/loading_indicator";
import {UserModel, UserDataService} from "../models";
import { Subscription }   from 'rxjs/Subscription';
import {Home} from "../home";

declare var Chart:any;
declare var swal:any;
declare var jQuery:any;
@Component({
    selector: "dashboard",
    templateUrl: "./dashboard.html",
    styleUrls: ["./dashboard.css"],
})
export class DashboardComponent implements OnDestroy {
    this_month: any;
    // get the canvas element from DOM
    @ViewChild('dashboardChart') chart: any;
    public isRequesting:boolean;
    index_errors: any;
    phone_number_error: any;
    amount_error: any;
    errors: any;
    send_airtime_spinner:boolean=false;

    userData = new UserModel();
    subscription: Subscription;

    constructor(public backendApis:BackendApis,
                private userDataService: UserDataService,
                 @Inject(forwardRef(() => Home)) home: Home) {
        this.userData = home.userData;

        this.subscription = this.userDataService.dataChangeAnnounced$.subscribe(
            data => {
                this.userData = data;
            });
        this.this_month = new Date().toDateString().substring(4, 7);
    }

    reset_error() {
        this.index_errors = false;
        this.phone_number_error = false;
        this.amount_error = false;
        this.errors = {};

    };

    send_airtime(event: any, phone_number: any, amount: any, phone: any) {
        this.send_airtime_spinner = true;
        event.preventDefault();
        this.isRequesting = true;
        var recipient = {};

        // I changed this to allow sending to many numbers :/
        for (let number of phone_number.split(",")) {
            recipient[number] = [amount, ''];
        }

        this.backendApis.send_airtime(recipient)
            .subscribe(
                response => {
                    this.send_airtime_spinner = false;
                    console.log(phone.value);
                    phone.value = '';
                    swal({
                        title: 'Successful',
                        text: 'Request to send airtime was successful',
                        timer: 2500,
                        showConfirmButton: false,
                        type: 'success'
                    });
                    this.reset_error();
                    this.isRequesting = false;
                    // console.log("there was a change");
                },
                error => {
                    console.log(error.json()[0].phone_number);
                    this.send_airtime_spinner = false;
                    let error_text: any;
                    if(error.json()[0].phone_number) {
                        error_text = error.json()[0].phone_number;
                    }
                    else if(error.json()[0].amount){
                        error_text = error.json()[0].amount;
                    }
                    else if(error.json()[0].error){
                        error_text = error.json()[0].error;
                    }
                    else {
                        error_text = 'An error occured during sending of airtime, re-try the transaction or abort.'
                    }
                    swal({
                        title: 'Error',
                        text: error_text,
                        type: 'error'
                    });
                    this.reset_error();
                    this.isRequesting = false;

                }
            )
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        this.subscription.unsubscribe();
  }

}
