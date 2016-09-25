/**
 * Created by marlyn on 4/15/16.
 */
import {Component} from '@angular/core';
import {BackendApis} from "../../../services/backend.apis";
import {Router} from "@angular/router";

@Component({
    selector: 'add-group',
    templateUrl: './add-group.html'
})

export class AddGroupComponent{
    error: any;

    constructor(public apiService: BackendApis, public router: Router){

    }
    onChange(name: any) {
        console.log(name);
    }

    createnewGroup(event: any, name: any){
        event.preventDefault();
        this.apiService.createGroup(name)
            .subscribe (
                response => {
                    console.log(response);
                    this.router.navigate(['/home/contacts']);
                },

                error => {
                    // console.log(error.json());
                    this.error = true;
                    this.error = error.text().replace(/"/g,"");
                    // console.log(this.error)

                }
            )
    }

}
