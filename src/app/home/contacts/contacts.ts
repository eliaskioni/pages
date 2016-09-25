import {Component, Input, ElementRef, AfterViewInit, Injectable} from "@angular/core";
import {BackendApis} from "../../services/backend.apis";
import {Router} from "@angular/router";
import {TopUpService} from "../../services/excel-top-up-service";
import {TopUpModel} from "../airtime/excel-topup/excel-top-up-model";
import {ContactsService} from "../../services/contacts-service";
import {SearchContactList} from "./contacts-pipe";
import {ContactsModel} from "./contacts-model";
import {SearchBox} from "../search-box";
import {LoadingIndicator} from "../../loading_indicator/loading_indicator";
import {Spinner} from "../../spinner/spinner-class";
import {SpinnerComponent} from "../../spinner/spinner";
import {Notifications} from "../../notifications/notification-component";
import {Notification} from "../../notifications/notifications-model";
import {NotificationsService} from "../../notifications/notification-service";
import {MultipleGroupSelect} from "./select_group";

declare var jQuery:any;
declare var swal:any;
// declare var select:any;

@Component({
    selector: 'contacts',
    templateUrl: './contacts.html',
    styleUrls: ['./contacts.css',],
    inputs: ['isSMS']
})

@Injectable()
export class Contacts {
    characters_typed: any;
    userName: any;
    charge: any;
    @Input() search_term: any;
    public isRequesting:boolean;
    public buttonStateEnabled:boolean;
    public checkboxStateEnabled:boolean;
    public contactsCount = 0;
    jwt:string;
    decodedJwt:string;
    contacts_list: any;
    //service list from model
    contactsList: any;
    contact_ids: Array<any> = [];
    contacts_count: any;
    trial_list: Array<any> = [];
    list: any;
    buttons = false;
    dicts: any;
    switch = true;
    data: any;
    topup: any;

    // page switch
    airtime = false;
    message_page = false;
    user_message = '';
    edit_contact = false;
    contacts_switch = true;
    delete_contact_page = false;
    delete_group_page = false;


    index_errors: any;
    phone_number_error: any;
    amount_error: any;
    errors: any;
    name_error: any;
    groups: any;
    deactivate: any;
    message_warn: any;

    contact_value: any;
    group_value: any;
    new_groups: Array<any> = [];
    selected_contacts_list:Array<any> = [];

    totals: any;
    show_totals: any;

    sender_id_list: Array<any>=[];

   // edit contact
    selected_values: any;
    group_ids: Array<any> = [];
    isSMS: any;
    send_airtime_spinner: any;
    edit_progress: any;

   constructor(private el: ElementRef, public _notes: NotificationsService, public backendApis:BackendApis, public topupService:TopUpService, public router:Router, public contactsService:ContactsService) {
        this.isRequesting=false;
        this.jwt = localStorage.getItem('jwt');
        this.buttonStateEnabled = false;
       this.get_account_message_id();
        this.checkboxStateEnabled = false;
        this.characters_typed=0;
        this.charge=0;
        this.backendApis.get_user().subscribe(
            response=>{
                this.userName = response.json().username;
            },
            error=>{
                console.log(error)
            });
        // this.decodedJwt = this.jwtHelper.decodeToken(this.jwt);
       this.get_groups();
        this.get_contacts('check');


    }

    get_groups() {
        this.backendApis.getGroups()
            .subscribe(
                response=> {
                    this.groups = response.json().results;
                    // console.log(this.groups);
                    // console.log('group', this.groups)
                },
                error => {
                    console.log(error)
                }
            );
    }

    get_contacts(check: any) {
        // console.log(select2);
        // console.log(swal);
        // console.log(typeof swal);
        // console.log(typeof select);
        if (check !== 'check' ){
            for(var dom of this.group_ids){
                document.getElementById(dom).style.backgroundColor = "white";
            }
        }
        this.group_ids = [];


        this.backendApis.get_contacts()
            .subscribe(
                response => {
                    this.contactsService.resetValue();
                    this.contacts_count = response.json().count;
                    this.contacts_list = response.json().results;
                    for (var dat of response.json().results) {
                        this.contactsService.setValue(new ContactsModel(dat.account, false, dat.names,
                            dat.phone_number, dat.group_set, dat.id));
                    }
                    this.contactsList = this.contactsService.getValue();
                    this.contactsCount = this.contactsList.length;
                    // console.log(this.contactsList);
                    // console.log(this.contactsList.length)
                    //console.log("the pk; ", this.contactsList[0].pk)
                },
                error => {
                    alert(error.text());
                    // console.log(error.text());
                }
            );
        this.get_account_message_id();


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

    typedAmout(val: any){
        let amount = parseInt(val);
        for (var t of this.topup){
            t.amount=amount;
        }
        this.total_transaction();
    }

    downloadContacts(event: any) {
        event.preventDefault();
        //empty the selected contacts list array
        this.selected_contacts_list.splice(0, this.selected_contacts_list.length);

        //get the data of ONLY the selected values. they'll have selected as TRUE
        for (var con of this.contactsList) {
            if (con.selected === true) {
                this.selected_contacts_list.push(con);
            }
        }
        // console.log("selected data", this.selected_contacts_list);

        var data: Array<any> = [];
        var contacts_data: Array<any> = [];
        contacts_data[0] = "Names";
        contacts_data[1] = "Phone Numbers";
        // contacts_data[2] = "Group";
        data.push(contacts_data);
        //use the selected list to send Airtime
        for (var item of this.selected_contacts_list) {

            var contacts_data = [];
            contacts_data[0] = item.names.toString();
            contacts_data[1] = item.phone_number.toString();
            // contacts_data[2] = item.group;
            data.push(contacts_data);
        }

        // console.log("all downloaded data", JSON.stringify(data));

        // var data = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
        var csvContent = "data:text/csv;charset=utf-8,";
        data.forEach(function (infoArray, index) {

            var dataString = infoArray.join(",");
            csvContent += index < data.length ? dataString + "\n" : dataString;

        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "contacts.csv");

        link.click();
    }

    getGroupIds(id: any){
        this.contact_ids = [];
        if(this.group_ids.indexOf(id)===-1) {
            this.group_ids.push(id);
            document.getElementById(id).style.backgroundColor = "aqua";
        }
        else {
            this.group_ids.splice(this.group_ids.indexOf(id), 1);
            document.getElementById(id).style.backgroundColor = "white";
        }
        this.getGroupContact(this.group_ids);

    }

    getGroupContact(g: any) {
        // console.log("the clicked group", g);
        this.backendApis.getGroupContact(g)
            .subscribe(
                response => {
                    // console.log(response.json().results);
                    this.contactsService.resetValue();
                    this.contacts_count = response.json().count;
                    this.contacts_list = response.json().results;
                    // console.log(this.contacts_list);
                    for (var dat of response.json().results) {
                        this.contactsService.setValue(new ContactsModel(dat.account, false, dat.names,
                            dat.phone_number, dat.group_set, dat.id));
                    }
                    this.contactsList = this.contactsService.getValue();
                    this.contactsCount = this.contactsList.length;
                    // console.log(this.contactsList);
                    // console.log(this.contactsList.length)
                    //console.log("the pk; ", this.contactsList[0].pk)
                },
                 error => {
                     console.log(error.json())
                 }
            )
    }

    checkbox(con: any) {
        con.selected = (con.selected) ? false : true;
        // console.log("con value", con.selected);
        if (con.selected == true) {
            this.contactsCount = this.contactsCount - 1;
            // console.log("1");
        }
        else {
            if (this.contactsCount < this.contactsList.length) {
                // console.log("else");
                this.contactsCount = this.contactsCount + 1;
            }
            else {
                // console.log("else2");
                this.contactsCount = this.contactsCount;
            }
        }
        this.buttonState(this.contactsCount);

        //simplified if statement to check the checkall checkbox if all contacts are selected
        (<HTMLInputElement>document.getElementById("checkall")).checked = this.contactsCount == 0;

        // console.log("initial count " + this.contactsList.length + " and present ", this.contactsCount);
    }

    toggleCheckbox(contactsList: any) {
        this.checkboxStateEnabled = (this.checkboxStateEnabled) ? false : true;
        // console.log("state of checkbox is ", this.checkboxStateEnabled);
        if (this.checkboxStateEnabled) {
            // console.log("checked");
            this.checkbox_all(contactsList, true);
        }
        else {
            // console.log("unchecked");
            this.checkbox_all(contactsList, false);
        }

        (<HTMLInputElement>document.getElementById("checkall")).checked = this.contactsCount == 0;
    }

    buttonState(value: any) {
        this.buttonStateEnabled = value < this.contactsList.length;
    }

    checkbox_all(contactList: any, value: any) {
        if (this.search_term) {
            for (var con of contactList) {
                if (con.group == this.search_term) {
                    con.selected = value;
                    if (con.selected == true) {
                        this.contactsCount = this.contactsCount - 1;
                        // console.log("1");
                    }
                    else {
                        if (this.contactsCount < this.contactsList.length) {
                            // console.log("else");
                            this.contactsCount = this.contactsCount + 1;
                        }
                        else {
                            // console.log("else2");
                            this.contactsCount = this.contactsCount;
                        }
                    }
                }
                this.buttonState(this.contactsCount);
                // console.log("initial count "+this.contactsList.length + " and present ", this.contactsCount);
            }

        }

        else {
            for (var con of contactList) {
                con.selected = value;
                if (con.selected == true) {
                    this.contactsCount = this.contactsCount - 1;
                    // console.log("1");
                }
                else {
                    if (this.contactsCount < this.contactsList.length) {
                        // console.log("else");
                        this.contactsCount = this.contactsCount + 1;
                    }
                    else {
                        // console.log("else2");
                        this.contactsCount = this.contactsCount;
                    }
                }
                this.buttonState(this.contactsCount);
                // console.log("initial count "+this.contactsList.length + " and present ", this.contactsCount);
            }
        }
    }

    reset_error() {
        this.index_errors = false;
        this.phone_number_error = false;
        this.amount_error = false;
        this.errors = {};
        this.name_error = false;
    }

    editContact(event: any, index: any) {
        event.preventDefault();
        this.edit_contact = true;
        this.airtime = false;
        this.contacts_switch = false;
        this.message_page = false;

        this.contact_value = this.contactsList[index];


        if (this.contact_value.group == null) {
            this.new_groups = this.groups;
        }

        else {
            for (var g of this.groups) {
                if (g.name != this.contact_value.group) {
                    this.new_groups.push(g);
                }
            }
            this.new_groups.splice(0, 0, {
                "account": "1",
                "id": this.groups.length + 1,
                "name": this.contact_value.group
            });

            this.new_groups.splice(this.groups.length, 0, {
                "account": 1,
                "id": this.groups.length + 1,
                "name": "-------"
            });
        }
        // console.log("the new group", this.new_groups);

    }

    updater(group_name: any) {
        console.log(group_name);
    }

    handleSelectedValues(arg: any) {
        this.selected_values = arg;
    }

    updateContact(group_name: any) {
        this.edit_progress = true;
        // console.log("selected_values:"+this.selected_values);
        var the_data_set = {};

        the_data_set["pk"] = this.contact_value.pk;
        the_data_set ["phone_number"] = this.contact_value.phone_number;
        the_data_set["names"] = this.contact_value.names;
        the_data_set['group_set'] = this.selected_values;
        the_data_set["account"] = this.contact_value.account;

        console.log("the data set", the_data_set);
        console.log("the string data", JSON.stringify(the_data_set));
        this.backendApis.updateContact(the_data_set).subscribe(
            response => {
                this.edit_progress = false;
                this.reset_error();
                this.get_groups();
                this.get_contacts('check');
                // console.log("the update response", response);
                this.edit_contact = false;
                this.airtime = false;
                this.contacts_switch = true;
                this.message_page = false;
            },
            error => {
                this.edit_progress = false;
                this.reset_error();
                console.log(error.json());
                // this.duplicate = true;
                // this.duplicate = this.contact_value.phone_number + ' already exists';
                // let error_message = error;
                if(error.json().non_field_errors) {
                    this.index_errors = error.json().non_field_errors[0];
                    console.log(this.index_errors, 'index error');
                    console.log('non field error')
                }

                if(error.json().names){
                    this.name_error = error.json().names;
                }

                if(error.json().phone_number) {
                    this.phone_number_error = error.json().phone_number;
                }


            }
        );

    }

    deleteContact(pk: any){
        // console.log("values to be deleted: ", JSON.stringify(pk));
        this.backendApis.deleteContactApi(pk).subscribe(
            response => {
                // console.log("the deleted response: ", response);
                this._notes.add(new Notification('success', 'Successfully deleted '+this.contact_value.phone_number));
                setTimeout(() => { this.resetDelete()}, 2500);

            }, error =>{
                // console.log("the error: ", error.json().detail);
                this._notes.add(new Notification('warning', error.json().detail));
            }
        )
    }

    deleteContactView(event: any, index: any){
        this.airtime = false;
        this.message_page = false;
        this.edit_contact = false;
        this.contacts_switch = false;
        this.delete_contact_page = true;

        this.contact_value = this.contactsList[index];

    }

    deleteGroupView(event: any, index: any){
        this.airtime = false;
        this.message_page = false;
        this.edit_contact = false;
        this.contacts_switch = false;
        this.delete_contact_page = false;
        this.delete_group_page = true;
        this.group_value = this.groups[index];
        // console.log(this.group_value);

        // this.contact_value = this.contactsList[index];

    }

    deleteGroup(pk: any){
        // console.log("values to be deleted: ", JSON.stringify(pk));
        this.backendApis.deleteGroupApi(pk).subscribe(
            response => {
                // console.log("the deleted response: ", response);
                for(var contact of this.contact_ids) {
                    this.backendApis.deleteContactApi(contact).subscribe(
                        response => {},
                        error => {
                            console.log('error')
                        }
                    )
                }
                this._notes.add(new Notification('success', 'Successfully deleted '+this.group_value.name));
                setTimeout(() => { this.resetDelete()}, 2500);
            }, error =>{
                // console.log("the error: ", error.json().detail);
                this._notes.add(new Notification('warning', error.json().detail));
            }
        )
    }

    resetDelete(){
        this.airtime = false;
        this.message_page = false;
        this.edit_contact = false;
        this.contacts_switch = true;
        this.delete_contact_page = false;
        this.delete_group_page = false;
        this.get_contacts('check');
        this.get_groups();

        // // since the contacts return with the pre-loaded contact values
        // // I make the call again to re-assign the values so when you switch to the contacts view
        // // the deleted contact does not exist
        // this.backendApis.get_contacts().subscribe(
        //     response =>{
        //         // console.log("the contacts before: ", this.contactsList);
        //         this.contacts_count = response.json().count;
        //         this.contacts_list = response.json().results;
        //
        //         //do a reset of the service to set fresh values
        //         this.contactsService.resetValue();
        //         for (var dat of response.json().results) {
        //             this.contactsService.setValue(new ContactsModel(dat.account, false, dat.names,
        //                 dat.phone_number, dat.group, dat.pk));
        //         }
        //
        //         this.contactsList = this.contactsService.getValue();
        //         this.contactsCount = this.contactsList.length;
        //         // console.log("the contacts: ", this.contactsList);
        //     }, error =>{
        //         console.log("error getting the contacts: ", error);
        //     }
        // )
    }

    total_transaction(){
        this.show_totals = true;
        var list: Array<any> = []
        for (var topup of this.topup) {
            list.push(topup.amount)
        }
        var sum = list.reduce(function (a, b) {
            return a + b;
        }, 0);
        this.totals = sum;
    }

    sendContactsAirtime() {
        // console.log(submit);
        this.send_airtime_spinner = true;
        this.isRequesting = true;
        this.deactivate = true;
        var the_data_set = {}; //{"0702729654":["10","names"], "0722576874":["20","names"]}

        for (var data_set of this.topup) {
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
                // this.deactivate = false;
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
                // this.deactivate = true;
                this.reset_error();
                this.isRequesting = false;
                // console.log('text error', error_message[0]);
                // if(error_message[0].phone_number) {
                //     this.phone_number_error = true;
                //     this.phone_number_error = error_message[0].phone_number
                // }
                // console.log(this.phone_number_error)
                if (error_message[0].amount) {
                    this.index_errors = true;
                    this.index_errors = error_message[0].amount;
                }

                if (error_message[0].error) {
                    this.index_errors = true;
                    this.index_errors = error_message[0].error;
                }
                // console.log('index errors',error_message.amount)
                // console.log(error_message[0].phone_number)
                // for (var item of error_message) {
                //     let index = item["index"];
                //     console.log('index', index)
                //
                //     if (index == -1) {
                //         this.index_errors = true;
                //         this.index_errors = item.error;
                //
                //         console.log('console error', this.index_errors)
                //     }
                //
                //     if (error_message['amount']) {
                //         console.log('amount', error_message['amount']);
                //     }
                //
                //     if (index == 0) {
                //         this.phone_number_error = true;
                //         this.phone_number_error = item.phone_number;
                //         this.amount_error = item.amount;
                //         console.log('amount', item.amount);
                //     }
                //
                //     if (index == 1) {
                //         this.amount_error = true;
                //         this.amount_error = item['error'];
                //     }
                // }

            }
        );
    }

    warning(event: any) {
        event.preventDefault();
        // console.log('this');
        this.message_warn = "Please wait we are sending your airtime"
    }

    sendMessage(event: any, text: any, sender_value: any) {
        this.user_message = text;
        let sender_id: any;
        sender_id = sender_value;
        console.log('sender', sender_id);
        event.preventDefault();
        this.isRequesting = true;
        // {"message_data":{"hi":[["0702729654","Mwas"],["0717199135","Kioni"]]}, "sender_id":"ADMIN"}
        var data = {};
        var recipient: Array<any> = [];

        for (var item of this.topup) {
            recipient.push([item.phone_number, item.first_name]);
        }
        data[text] = recipient;
        let message = {}
        message['message_data'] = data;
        message['sender_id'] = sender_id;
        message['calculated_cost'] = this.charge;
        // console.log(message);
        // console.log("message rep", JSON.stringify(message));

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
                    // this.deactivate = false;
                    this.isRequesting = false;
                    this.router.navigate(['/home/thanks']);
                },
                error => {
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
                    this.reset_error();
                    // this.deactivate = false;
                    this.isRequesting = false;
                    console.log('error text', error.text());
                    for (var item of error_message) {
                        // console.log('item', item)
                        let index = item["index"];
                        // console.log('index', index)

                        if (index == -1) {
                            this.amount_error = true;
                            this.amount_error = item['error'];
                            // console.log('console error', this.amount_error)
                        }

                        if (item['to']) {
                            this.phone_number_error = true;
                            this.phone_number_error = item['to'];

                            // console.log('num error', this.phone_number_error);
                        }
                    }

                }
            )
    }

    sendAirtime(event: any) {
        event.preventDefault();
        this.airtime = true;
        this.contacts_switch = false;
        this.message_page = false;
        this.edit_contact = false;

        //empty the selected contacts list array
        this.selected_contacts_list.splice(0, this.selected_contacts_list.length);

        //get the data of ONLY the selected values. they'll have selected as TRUE
        for (var con of this.contactsList) {
            if (con.selected === true) {
                this.selected_contacts_list.push(con);
            }
        }

        //use the selected list to send Airtime
        this.topupService.topup = [];
        for (var item of this.selected_contacts_list) {
            this.topupService.topup.push(new TopUpModel(item.names, item.phone_number, 10))
            this.topup = this.topupService.topup;
        };

        this.total_transaction()
    }

    sendSMS(event: any) {
        event.preventDefault();
        this.message_page = true;
        // console.log(this.message_page)
        this.contacts_switch = false;
        this.airtime = false;
        this.edit_contact = false;

        //empty the selected contacts list array
        this.selected_contacts_list.splice(0, this.selected_contacts_list.length);

        //get the data of ONLY the selected values. they'll have selected as TRUE
        for (var con of this.contactsList) {
            if (con.selected === true) {
                this.selected_contacts_list.push(con);
            }
        }

        //use the selected list to send SMS
        this.topupService.topup = [];
        for (var item of this.selected_contacts_list) {
            this.topupService.topup.push(new TopUpModel(item.names, item.phone_number, 10));
            this.topup = this.topupService.topup;
        }
    }

    addNewChoice() {
        this.topupService.topup.push(new TopUpModel());
        this.total_transaction();
    }

    removeChoice(index: any) {
        this.topupService.topup.splice(index, 1);
        this.total_transaction();
    }

    get_contact(event: any, index: any) {
        event.preventDefault();
        this.dicts = this.contactsList[index].group;
    }

    delete_group_contacts(contact_id: any) {
        // contact_ids.push(101);
        var index = this.contact_ids.indexOf(contact_id);
        if (index === -1) {
            this.contact_ids.push(contact_id)
        }
        else {
            this.contact_ids.splice(index, 1);
        }

    }
}
