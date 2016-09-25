import {Injectable} from "@angular/core";
import {ContactModel} from "../home/contacts/add-contacts-excel/excel-contact-model";
/**
 * Created by kioni on 4/25/16.
 */
@Injectable()
export class ContactsService{
    private contacts_list: Array<any>=[];

    constructor() {}
    
    resetValue() {
        this.contacts_list= []
    }
    
    setValue(val: any) {
        this.contacts_list.push(val);
    }

    getValue() {
        return this.contacts_list;
    }

    addContact(contacts: ContactModel){
        this.contacts_list = [...this.contacts_list, contacts];

    }
}

