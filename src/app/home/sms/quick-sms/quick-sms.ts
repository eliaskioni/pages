import {Component, ViewChild, ElementRef} from "@angular/core";
import {BackendApis} from "../../../services/backend.apis";
import {Router} from "@angular/router";
declare var jQuery:any;

declare var swal:any;

@Component({
    selector: 'quick-sms',
    templateUrl: './quick-sms.html',
    styleUrls: ['./quick-sms.css'],
})

export class QuickSMSComponent{
    public isRequesting: boolean;
    index_errors: any;
    phone_number_error: any;
    phone_numbers: any='';
    message_error: any;
    errors: any;
    duplicates_error: any;
    duplicates_list: any;
    characters_typed: any;
    user_message: any='';
    userName: any;
    charge: any;
    sender_id_list: Array<any>=[];

    constructor(public backendApis: BackendApis, private router: Router, private el:ElementRef) {
        this.reset_error();
        this.isRequesting = false;
        this.characters_typed=0;
        this.charge=0;
        this.get_account_message_id();
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

    reset_error(){
        this.index_errors = false;
        this.phone_number_error = false;
        this.message_error = false;
        this.duplicates_error = false;
        this.errors = {};
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

    send_message(event: any, phone_number: any, text: any, sender_value: any) {
        this.user_message = text;
        let sender_id: any;
        sender_id = sender_value;
        console.log('sender_id', sender_id)

        event.preventDefault();
        this.isRequesting = true;
        var list: Array<any>  =  [];
        // console.log(typeof message);
        var no = [phone_number.split(',')];
        var q: Array<any> = [];
        for (var d of no[0]) {
            q.push(d.trim())
        }
        for (var x=0; x<no[0].length; x++) {
            if (no[0][x] !== ',') {
                list.push(no[0][x].replace(/ /g,''))
            }
        }
        // console.log('list', list)
        var uniq = q
            .map((name) => {
                return {count: 1, name: name}
            })
            .reduce((a, b) => {
                a[b.name] = (a[b.name] || 0) + b.count;
                return a
            }, {});

        var duplicates: Array<any> = [];

        duplicates.push(Object.keys(uniq).filter((a) => uniq[a] > 1))
        // console.log(duplicates[0].length, 'duplicates');

        // console.log(duplicates[0])

        if (duplicates[0].length > 0) {
            this.isRequesting = false;
            this.reset_error();
            this.duplicates_error=true;
            this.duplicates_list=[];
            for( var dup of duplicates[0]) {
                this.duplicates_list.push(dup)
            }
        }

        else{
            list = list.filter(Boolean);
            let numbers: Array<any> = [];
            this.phone_numbers = '';
            for (var fone of list) {
                this.phone_numbers = phone_number + ',' + fone;
                numbers.push([ fone, ''])
            }
            var recipient = {};
            recipient[text] = numbers;
            let message = {};
            message['message_data'] = recipient;

            message['sender_id'] = sender_id;
            message['calculated_cost'] = this.charge;
            this.backendApis.send_message(message)
                .subscribe(
                    response => {
                        swal({
                            title: 'Successful',
                            text: 'Request to send SMS was successful',
                            timer: 2500,
                            showConfirmButton: false,
                            type: 'success'
                        });
                        this.reset_error();
                        this.isRequesting = false;
                        this.router.navigate(['/home/thanks']);
                    },
                    error => {
                        console.log(error.json());
                        let error_message = error.json();
                        let error_text: any;
                        if(error_message[0].message){
                            error_text = error_message[0].message;
                        }
                        else if(error_message[0].to) {
                            error_text = error.json()[0].to;
                        }
                        else if(error_message[0].error){
                            error_text = error_message[0].error;
                        }
                        else {
                            error_text = 'An error occured during sending of SMS, re-try the transaction or abort.'
                        }

                        swal({
                            title: 'Error',
                            text: error_text,
                            type: 'error'
                        });
                        this.isRequesting = false;
                        this.reset_error();
                        let text = error.json();
                        console.log(text);
                        for (var item of text) {
                            let index = item["index"];
                            if (index == -1) {
                                this.index_errors = true;
                                this.errors['index'] = item.error;
                            }

                            if (index == 0) {
                                this.phone_number_error = true;
                                this.phone_number_error = item.to;
                            }
                            if (index == 1) {
                                this.message_error = true;
                                this.message_error = item.amount;
                            }
                        }
                    }
                )
        }


    }

}
