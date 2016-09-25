/**
 * Created by marlyn on 4/15/16.
 */
import {Component} from "@angular/core";
import {ContactModel} from "./excel-contact-model";
import {BackendApis} from "../../../services/backend.apis";
import {Router} from "@angular/router";

@Component({
    selector: 'add-contacts-excel',
    templateUrl: './add-contacts-excel.html'
})

export class AddContactsExcelComponent {

    filesToUpload:Array<File>;
    data: any;
    switch = true;
    contacts: Array<any> = [];
    index_errors: any;
    phone_number_error: any;
    errors: any;
    error: any;
    excel_error: any;

    constructor(public backendApis:BackendApis, public router:Router) {

    }


    fileChangeEvent(fileInput:any) {
        this.filesToUpload = <Array<File>> fileInput.target.files;
    }


    makeFileRequest(url:string, params:Array<string>, files:Array<File>) {
        return new Promise((resolve: any, reject: any) => {
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();
            for (var i = 0; i < files.length; i++) {
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
            console.log('formdata:' + formData);
            xhr.send(formData);
        });
    }


    addContacts(event: any) {
        event.preventDefault();

        console.log('contacts models: ', JSON.stringify(this.contacts));
        // console.log("the list", JSON.stringify(contact_list));
        this.backendApis.addBulkContact(this.contacts)
            .subscribe(
                response=> {
                    this.router.navigate(['/home/contacts']);
                },

                error => {
                    this.phone_number_error = "this phone numbers exists"
                }
            )
    }

    reset_error() {
        this.index_errors = false;
        this.phone_number_error = false;
        this.errors = {};
    }

    onSubmit() {
        var the_data_set = {}; //{"0702729654":["10","names"], "0722576874":["20","names"]}

        for (var data_set of this.contacts) {
            the_data_set[data_set.phone_number] = [data_set.amount.toString(), data_set.first_name];
        }

        // console.log("the data set", JSON.stringify(the_data_set));

        this.backendApis.addContact(the_data_set).subscribe(
            response => {
                this.reset_error();
                this.router.navigate(['/home/contacts']);
            },
            error => {
                this.reset_error();
                console.log("excel upload error: ", error);

            }
        );
    }

    upload() {
        // this.makeFileRequest("http://127.0.0.1:8000/api_v1/upload_excel_contacts_file", [], this.filesToUpload).then((result) => {
        this.makeFileRequest(this.backendApis.base_url + "/api_v1/upload_excel_contacts_file", [], this.filesToUpload).then((result: any) => {
            this.switch = false;

            this.data = result;

            for (var item of this.data) {
                this.contacts.push(new ContactModel(item.names, item.phone_number));
                // this.topupService.topup.push();
            }

        }, (error: any) => {
            this.reset_error();
            console.log('str', error.replace(/"/g, ""));
            this.excel_error = true;
            this.excel_error = "provided excel file is not correct please ensure it is in the same format as the sample excel file and upload again";
            // this.excel_error = error.replace(/"/g,"");
        });
    }

}
