/**
 * Created by marlyn on 4/15/16.
 */
import {Component} from '@angular/core';
import {BulkTopupComponent} from "../bulk-topup/bulk-topup";
import {TopUpModel} from "./excel-top-up-model";
import {TopUpService} from "../../../services/excel-top-up-service";
import {BackendApis} from "../../../services/backend.apis";
import {Router} from "@angular/router";
import {LoadingIndicator} from "../../../loading_indicator/loading_indicator";

declare var swal:any;

@Component({
    selector: 'excel-topup',
    templateUrl: './excel-topup.html',
    styleUrls: ['./excel-topup.css'],
    providers: [TopUpService]
})

export class ExcelTopupComponent{
    excelTopupModel = new TopUpModel();
    filesToUpload: Array<File>;
    switch=true;
    data:any;
    topup:any;

    public isRequesting: boolean;

    index_errors: any;
    phone_number_error: any;
    amount_error: any;
    errors: any;
    excel_error: any;

    totals: any;
    show_totals:any;
    send_airtime_spinner: any;

    constructor(public topupService: TopUpService, public backendApis:BackendApis, private router: Router) {
        this.isRequesting=false;
        this.filesToUpload = [];
    }

    reset_error(){
        this.index_errors = false;
        this.phone_number_error = false;
        this.amount_error = false;
        this.errors = {};
    }

    total_transaction(){
        this.show_totals = true;
        var list: any = [];
        for (var topup of this.topup) {
            list.push(topup.amount)
        }
        var sum: any = list.reduce(function (a:any, b:any) {
            return a + b;
        }, 0);
        this.totals = sum;
    }

    upload() {
        // this.makeFileRequest("http://127.0.0.1:8000/api_v1/bulk_topup_via_excel", [], this.filesToUpload).then((result) => {
        this.makeFileRequest( this.backendApis.base_url+"/api_v1/bulk_topup_via_excel", [], this.filesToUpload).then((result: any) => {
            this.switch=false;

            this.data =result;

            for(var item of this.data){
                this.topupService.topup.push(new TopUpModel(item.first_name, item.phone_number, item.amount))
                this.topup = this.topupService.topup;
                // this.topupService.topup.push();
            }
            this.total_transaction()

        }, (error: any) => {
            this.reset_error();
            // console.log('str', error.replace(/"/g,""))
            this.excel_error=true;
            this.excel_error = "provided excel file is not correct please ensure it is in the same format as the sample excel file and upload again";
        });
    }

    sendExcelAirtime(){
        this.isRequesting = true;
        this.send_airtime_spinner = true;
        var the_data_set = {}; //{"0702729654":["10","names"], "0722576874":["20","names"]}

        for(var data_set of this.topup){
            the_data_set[data_set.phone_number] = [data_set.amount.toString(), data_set.first_name];
        }

        // console.log("the data set", JSON.stringify(the_data_set));

        this.backendApis.send_airtime(the_data_set).subscribe(
            response => {
                this.send_airtime_spinner = false;
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
            },
            error => {
                let error_message = error.json();
                console.log(error_message);
                this.send_airtime_spinner = false;
                let error_text: any;
                if(error.json()[0].phone_number) {
                    error_text = error.json()[0].phone_number;
                }
                else if(error_message[0].error){
                    error_text = error_message[0].error;
                }
                else if(error_message[0].amount){
                    error_text = error_message[0].amount;
                }
                else{
                    error_text = 'An error occured during sending of airtime, re-try the transaction or abort.'
                }
                swal({
                    title: 'Error',
                    text: error_text,
                    type: 'error'
                });
                this.reset_error();

                this.isRequesting = false;
                // console.log(error.text());
                for (var item of error_message){
                    let index = item["index"];

                    if (index == -1){
                        this.index_errors = true;
                        this.index_errors = item.error;

                        // console.log('console error', this.index_errors)
                    }

                    if (index == 0){
                        this.phone_number_error = true;
                        this.phone_number_error = item.phone_number;
                    }

                    if (index == 1){
                        this.amount_error = true;
                        this.amount_error = item.amount;
                    }
                }

            }
        );
    }

    addNewChoice(){
        this.topupService.topup.push(new TopUpModel());
        this.total_transaction();
    }

    removeChoice(index: any){
        this.topupService.topup.splice(index, 1);
        this.total_transaction();
    }

    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>> fileInput.target.files;
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        return new Promise((resolve:any, reject:any) => {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();
            for(var i = 0; i < files.length; i++) {
                formData.append("file", files[i], files[i].name);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open("POST", url, true);
            console.log('formdata:'+ formData);
            xhr.send(formData);
        });
    }

}
