/**
 * Created by marlyn on 4/15/16.
 */
import {Component} from '@angular/core';
import {BackendApis} from "../../../services/backend.apis";
import {Router} from "@angular/router";
import {TopUpService} from "../../../services/excel-top-up-service";
import {TopUpModel} from "../excel-topup/excel-top-up-model";
declare var swal:any;

@Component({
    selector: 'bulk-topup',
    templateUrl: './bulk-topup.html',
    styleUrls: ['./bulk-topup.css']
})

export class BulkTopupComponent{
    data: any;

    public isRequesting: boolean;

    index_errors: any;
    phone_number_error: any;
    amount_error: any;
    errors: any;
    error_index: any;
    topup: any;
    totals: any;
    show_totals: any;
    constructor(public backendApis: BackendApis, private router: Router, public topUpService: TopUpService){
        this.reset_error();
        this.topUpService.topup = [];
        this.topUpService.topup.push(new TopUpModel());
        this.topup=this.topUpService.topup;
        this.isRequesting=false;
        this.total_transaction()
    }

    reset_error(){
        this.index_errors = false;
        this.phone_number_error = false;
        this.amount_error = false;
        this.errors = {};
        this.error_index = "";
    }

    sendBulkAirtime(){
        this.isRequesting = true;
        var the_data_set = {};

        for(var data_item of this.topup){
            the_data_set[data_item.phone_number] = [data_item.amount.toString(), data_item.first_name];
        }

        this.backendApis.send_airtime(the_data_set).subscribe(
            response => {
                swal({
                    title: 'Successful',
                    text: 'Request to send airtime was successful',
                    timer: 2500,
                    showConfirmButton: false,
                    type: 'success'
                });
                this.reset_error();
                this.data = response;
                this.isRequesting = false;
                this.router.navigate(['/home/thanks']);
            },
            error => {
                swal({
                    title: 'Error',
                    text: 'An error occured during sending of airtime, re-try the transaction or abort.',
                    type: 'error'
                });
                this.reset_error();
                this.isRequesting = false;
                let error_message = error.json();
                console.log(error.text());

                for (var item of error_message){
                    let index = item["index"];

                    if (index == -1){
                        this.index_errors = true;
                        this.error_index = item.error;
                    }
                    // if (index == 0){
                    //     this.phone_number_error = true;
                    //     this.phone_number_error = item.phone_number;
                    // }
                    if (index == 0){
                        this.amount_error = true;
                        this.amount_error= item.amount;
                    }
                }

            }
        )
    }

    addNewChoice() {
        this.topUpService.topup.push(new TopUpModel());
        this.total_transaction()
    }

    removeChoice(index: any){
        this.topUpService.topup.splice(index, 1);
        this.total_transaction()
    }

    // var a = [1,2,3];
    // var sum = a.reduce(function(a, b) { return a + b; }, 0);

    total_transaction(){
        this.show_totals = true;
        var list: any = [];
        for (var topup of this.topup) {
            list.push(topup.amount)
        }
        var sum: any = list.reduce(function (a: any, b:any) {
            return a + b;
        }, 0);
        this.totals = sum;
    }
}
