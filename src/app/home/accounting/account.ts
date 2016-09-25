/**
 * Created by kioni on 7/12/16.
 */

import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from "@angular/core";
import {BackendApis} from "../../services/backend.apis";
import {RouterLink} from "@angular/router";
import {BillingPreLoader} from "../billing/billing-loader";
import {FormatDatePipe} from "../airtime/reports/date-pipe";
import {Observable} from "rxjs/Observable";
import {DateSearch} from "../date-search";

declare var jQuery:any;
declare var moment:any;
declare var sweetAlert: any;

@Component({
    selector: "dashboard",
    templateUrl: "./account.html",
})
export class Accounting implements AfterViewInit, OnInit{
    accounting_data: any = [];
    daterange='';
    opening_balance: any;
    accounting_data_length: any;
    closing_balance: any;

    constructor(public backendApis:BackendApis, private el:ElementRef) {
        this.get_accounting_data();
        console.log('elias check');
    }

    get_accounting_data() {
        this.backendApis.get_accounting_data(this.daterange)
            .subscribe(
                response => {
                    this.accounting_data = response.json().results.reverse();
                    this.accounting_data_length = this.accounting_data.length;
                    this.accounting_balance(this.accounting_data_length);
                    console.log(this.accounting_data);
                },
                error => {
                    console.log(error.json());
                }
            )
    }

    accounting_balance(count: any) {
        if (count > 1) {
            this.opening_balance = this.accounting_data.slice(-1).pop().balance;
            this.closing_balance = this.accounting_data[0].balance;
            console.log(this.closing_balance);
        }

        else if (count == 1) {
            let balance: any;
            let amount = this.accounting_data[0].amount.split(/\s+/)[0];
            this.opening_balance = this.accounting_data[0].balance;
            if (this.accounting_data[0].description === 'PROMOTIONAL RECHARGE') {
                balance = parseInt(this.opening_balance);
                this.opening_balance = 0;
            }
            else if (this.accounting_data[0].transaction_type === 'DEBIT' || this.accounting_data[0].transaction_type === 'PROMOTIONAL RECHARGE') {
                balance = parseInt(this.opening_balance) + parseInt(amount);
            }
            else {
                balance = parseInt(this.opening_balance) - parseInt(amount);
            }
            this.opening_balance = balance;
            this.closing_balance = this.accounting_data[0].balance;
        }
        else {
            this.opening_balance = 0;
            this.closing_balance = 0;
        }

    }
    ngOnInit() {
        setInterval(()=> {
            this.get_accounting_data();
        }, 10000);
    }

    ngAfterViewInit() {
        jQuery(this.el.nativeElement).find('input[name="daterange"]').daterangepicker({
                "showISOWeekNumbers": true,
                "startDate": "01/01/2016",
                "endDate": "12/31/2016",
                "opens": "left",
                "alwaysShowCalendars": true,
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            },
            (start:any, end:any, label:any)=> {
                // get date range
                this.daterange =  start.format('MM/DD/YYYY') + "-" + end.format('MM/DD/YYYY');;
                this.get_accounting_data();
            });

    }



}
