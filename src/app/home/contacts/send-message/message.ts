/**
 * Created by kioni on 4/24/16.
 */

import {Component} from '@angular/core';
import {ContactsService} from "../../../services/contacts-service";

@Component({
    selector: 'message-contact',
    templateUrl: './send-message.html',
    providers: [ContactsService]
})

export class MessageContact{
    topup: Array<any> = [];
    constructor(public contactsService: ContactsService) {
        console.log("service data", contactsService.getValue());
        this.get_topup()
    }

    get_topup() {
        // this.topup =this.contacts.selectedData();
        // console.log('topup', this.topup);
    }




}
