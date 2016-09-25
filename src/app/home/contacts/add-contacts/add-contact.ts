/**
 * Created by marlyn on 4/15/16.
 */
import {Component} from '@angular/core';
import {BackendApis} from "../../../services/backend.apis";
import {Router} from "@angular/router";
import {MultipleGroupSelect} from "../select_group";
import {LoadingIndicator} from "../../../loading_indicator/loading_indicator";

@Component({
    selector: 'add-contact',
    templateUrl: './add-contact.html',
})

export class AddContactComponent{
    groups: any;
    error: any;
    account_id: any;
    selected_values: any;
    post_progress: any;
    constructor(public backendService: BackendApis, public router: Router) {
        this.backendService.getGroups()
            .subscribe(
                response=> {
                    this.groups = response.json().results;
                    console.log(this.groups)
                },

                error=> {
                    console.log(error)
                }
            );
        this.get_user_account();
    }

    get_user_account() {
        this.backendService.get_user()
            .subscribe(
                res => {
                    this.account_id = res.json().account['id'];
                }
            )
    }

    handleSelectedValues(arg: any) {
        this.selected_values = arg;
    }

    addContact(event: any, names: any, phone_number: any) {
        event.preventDefault();
        this.post_progress = true;
        var data: Object = {};
        console.log(phone_number);
        if(phone_number.startsWith('0')) {
            console.log(phone_number)
            console.log(phone_number.replace('07', '+2547'));
            phone_number = phone_number.replace('07', '+2547')
        }
        data['names']=names;
        data['phone_number']=phone_number;
        console.log(this.selected_values);
        data['group_set']=this.selected_values;
        data['account'] = this.account_id;

        this.backendService.addContact(data)
            .subscribe(
                response=> {
                    // console.log('success', response);
                    this.router.navigate(['/home/contacts'])
                },

                error => {
                    this.post_progress = false;
                    this.error = true;
                    if (error.json().non_field_errors) {
                        this.error = error.json().non_field_errors[0];
                        console.log(error.json())
                    }
                    if (error.json().phone_number) {
                        this.error = error.json().phone_number[0];
                        console.log(error.json())
                    }
                    // let phone_number_error = error.json().phone_number[0];
                    // console.log('phone number error');
                    // this.error = true;
                    // this.error = phone_number_error;


                }
            )

    }

}
