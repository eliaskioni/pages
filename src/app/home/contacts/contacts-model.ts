/**
 * Created by musale on 4/27/16.
 */
export class ContactsModel{
    constructor(public account:string = '',public selected:boolean = false, public names:string = '', public phone_number:string = '', public group:string = '', public pk:string = ''){}
}