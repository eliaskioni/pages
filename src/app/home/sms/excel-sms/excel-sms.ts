import {Component, ElementRef} from '@angular/core';
import {BackendApis} from "../../../services/backend.apis";
import {Router} from "@angular/router";
import {NameNumberFieldComponent} from "../name-number-field";
import {SMSService} from "../../../services/sms-top-up-service";
import {SMSModel, ExcelSMSModel} from "../sms-model";
declare var jQuery: any;

declare var swal:any;

@Component({
    selector: 'excel-sms',
    templateUrl: './excel-sms.html',
    styleUrls: ['./excel-sms.css'],
    providers: [SMSService]
})

export class ExcelSMSComponent{
    characters_typed: any;
    userName: any;
    charge: any;
    filesToUpload: Array<File>;
    switch=true;
    data: any;
    sms: any;

    public isRequesting: boolean;

    excel_error: any;
    index_errors: any;
    phone_number_error: any;
    errors: any;

    sender_id_list: Array<any>=[];

    constructor(public backendApis: BackendApis, private router: Router, public smsService: SMSService, private el:ElementRef) {
        this.filesToUpload = [];
        this.reset_error();
        this.isRequesting=false;
        this.characters_typed=0;
        this.get_account_message_id();
        this.charge=0;
        this.backendApis.get_user().subscribe(
            response=>{
                this.userName = response.json().username;
            },
            error=>{
                console.log(error)
            })
    }

    get_account_message_id() {
        this.backendApis.get_account_message_id()
            .subscribe(
                response=> {
                    for (var sender of response.json().results) {
                        this.sender_id_list.push(sender.sender_id);
                    }
                    this.sender_id_list.push('AFRICANSTKNG');
                },
                error => {
                    console.log(error.json())
                }
            );
    }

    attachDontReply(textValue: any){
        let theMessage = textValue;
        let dontReplyCheckBoxValue = (<HTMLInputElement>document.getElementById("dontReply")).checked;
        let dontReply = "DON'T REPLY";
        if (dontReplyCheckBoxValue){
            jQuery(this.el.nativeElement).find('textarea[id="message"]').val(`${theMessage} ${dontReply}`);
        }else{
            theMessage = theMessage.replace(dontReply,'').trim();
            jQuery(this.el.nativeElement).find('textarea[id="message"]').val(`${theMessage}`);
        }
    }

    attachUsername(textValue: any){
        let theMessage = textValue;
        let userNameCheckBoxValue = (<HTMLInputElement>document.getElementById("attachUsername")).checked;
        if(userNameCheckBoxValue){
            jQuery(this.el.nativeElement).find('textarea[id="message"]').val(`${theMessage} ${this.userName}`);
        }
        else {
            theMessage = theMessage.replace(this.userName,'').trim();
            jQuery(this.el.nativeElement).find('textarea[id="message"]').val(`${theMessage}`);
        }
    }
    character_counter(message: any) {
        this.characters_typed = message.length;
        let length = this.characters_typed;
        //get the extra characters when you divide the typed characters by 140
        // i.e. 285 % 160 = 5
        let extra_one = length % 160;

        // remove the extra characters and the divide this value by 140 to get
        // the amount to pay for the characters i.e. (285 - 5)/160 = 2 that means
        // the 1st charge is KES. 2
        let extra_exact = (length - extra_one) / 160;

        // and then add 1 for the extra_one (5 characters) thus charge is 3
        this.charge = extra_exact + 1;

    }

    reset_error(){
        this.index_errors = false;
        this.phone_number_error = false;
        this.errors = {};
    }

    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>> fileInput.target.files;
    }

    uploadExcelContacts() {
        this.makeFileRequest(this.backendApis.base_url+"/api_v1/bulk_sms_via_excel", [],
            this.filesToUpload).then((result: any) => {
            this.reset_error();
            // console.log("here");
            // console.log(result);
            this.switch=false;
            this.data =result;

            for(var data_item of this.data){
                this.smsService.sms.push(new ExcelSMSModel(data_item.to, data_item.names));
                this.sms = this.smsService.sms;
            }

            // console.log("the sms uploaed", JSON.stringify(this.sms));
            // console.log("the sms length", this.sms.length);
        }, (error: any) => {
            this.reset_error();
            // console.log('str', error.replace(/"/g,""));
            this.excel_error=true;
            this.excel_error="provided excel file is not correct please ensure it is in the same format as the sample excel file and upload again"
            // this.excel_error = error.replace(/"/g,"");
        });
    }
    reset_errors() {
        this.excel_error=false;
        // console.log('clicked')
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        return new Promise((resolve: any, reject: any) => {
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
            };
            xhr.open("POST", url, true);
            // console.log('formdata:'+ formData);
            xhr.send(formData);
        });
    }

    removeChoice(index: any){
        this.smsService.sms.splice(index, 1);
    }

    addNewChoice(){
        this.smsService.sms.push(new ExcelSMSModel());
    }

    sendExcelSMS(text: any, sender_value: any){
        let sender_id: any;
        sender_id = sender_value;
        event.preventDefault();
        this.isRequesting = true;
        var data: Object = {};
        var recipient: Array<any> = [];

        for (var item of this.sms){
            recipient.push([item.phone_number, item.names]);
        }
        data[text]=recipient;
        let message = {};
        message['message_data'] = data;
        message['sender_id'] = sender_id;
        message['calculated_cost'] = this.charge;
        // console.log("message rep", JSON.stringify(message));

        this.backendApis.send_message(message)
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
                            this.phone_number_error = item.to;

                        }
                    }

                }
            )
    }
}
