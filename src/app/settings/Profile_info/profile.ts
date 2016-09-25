/**
 * Created by kioni on 5/18/16.
 */

import {Component} from "@angular/core";
import {BackendApis} from "../../services/backend.apis";
@Component({
    templateUrl: './profile.html'
})

export class ProfileInfo {
    username: any;
    firstname: any;
    lastname: any;
    email: any;
    constructor(private backendApis: BackendApis) {
        this.submit()

    }

    submit() {
        // event.preventDefault();
        this.backendApis.get_simple_user()
            .subscribe(
            response => {
                let res = response.json();
                this.username = res['username'];
                this.firstname = res['firstname'];
                this.lastname = res['lastname'];
                this.email = res['email'];
            },
                errors => {
                console.log(errors)
            }

        )

    }

}
