/**
 * Created by marlyn on 4/15/16.
 */
import {Component, AfterViewInit, ElementRef} from '@angular/core';
import {BackendApis} from "../../../services/backend.apis";
import { Router } from '@angular/router';
import {SpinnerComponent} from "../../../spinner/spinner";
import {Spinner} from "../../../spinner/spinner-class";

declare var swal:any;
declare var jQuery:any;

@Component({
    selector: 'quick-topup',
    templateUrl: './quick-topup.html',
    styleUrls:['./quick-topup.css'],
})

export class QuickTopupComponent implements AfterViewInit{
    public isRequesting: boolean;
    index_errors: any;
    phone_number_error: any;
    amount_error: any;
    errors: any;
    constructor(public backendApis: BackendApis, private router: Router, private el:ElementRef){
        this.reset_error();
        this.isRequesting = false;
    }

    ngAfterViewInit(){
        let tagElement = jQuery(this.el.nativeElement).find('input[id=phone_number]');
        tagElement.tagsinput({
            onTagExists: (item: any, $tag:any)=> {
                this.reset_error();
                this.phone_number_error = true;
                this.errors["phone_number"] = `${item} exists`;
            },
            confirmKeys: [13, 188,32],
        });
        tagElement.on('beforeItemAdd', (event: any)=>{
            let regEx = new RegExp("^(?:07|[\]+2547)[0-9]{8}$");
            if (regEx.test(event.item)){
                this.reset_error();
            }
            else{
                this.reset_error();
                this.phone_number_error = true;
                this.errors["phone_number"] = `${event.item} is not a valid phone number`;
            }
        });
    }


    reset_error(){
        this.index_errors = false;
        this.phone_number_error = false;
        this.amount_error = false;
        this.errors = {};
    }
    send_airtime(event: any, phone_number:any, amount:any){
        event.preventDefault();
        this.isRequesting = true;
        var recipient = {};

        // I changed this to allow sending to many numbers :/
        for (let number of phone_number.split(",")){
            recipient[number] = [amount, ''];
        }

        this.backendApis.send_airtime(recipient)
            .subscribe(
                response => {
                    swal({
                        title: 'Successful',
                        text: 'Request to send airtime was successful',
                        timer: 2500,
                        showConfirmButton: false,
                        type: 'success'
                    });
                    this.reset_error();
                    this.isRequesting = false;
                    this.router.navigate(['/home/thanks']);
                    // console.log("there was a change");
                },
                error => {
                    swal({
                        title: 'Error',
                        text: 'An error occured during sending of airtime, re-try the transaction or abort.',
                        type: 'error'
                    });
                    this.reset_error();
                    this.isRequesting = false;
                    // console.log("there was a change");
                    let text = error.json();
                    for (var item of text){
                        let index = item["index"];
                        if (index==-1){
                            this.index_errors = true;
                            this.errors['index'] = item.error;
                        }
                        else {
                            if (item.phone_number){
                                this.phone_number_error = true;
                                this.errors["phone_number"] = item.phone_number;
                            }
                            if (item.amount){
                                this.amount_error = true;
                                this.errors["amount"] = item.amount;
                            }

                            // console.log("index:"+ this.index_errors);
                            // console.log("phone_erro:" + this.phone_number_error);
                            // console.log("amount_error:" + this.amount_error);
                        }
                    }
                }
            )
    }
}
