/**
 * Created by kioni on 5/18/16.
 */
import {Component} from "@angular/core";
import {BackendApis} from "../../services/backend.apis";
import {Router} from "@angular/router";
@Component({
    templateUrl: './change_password.html'
})

export class ChangePassword{
    success_alert: any;
    error_alert: any;
    old_password_error: any;
    mismatch: any;
    constructor(public router:Router,private backendApis: BackendApis) {

    }

    submit(event: any,old_password: any, password1: any, password2: any) {
        event.preventDefault();
        var resets ={};
        if(password1 === password2) {
            resets['old_password'] = old_password;
            resets['new_password'] = password1;
            this.backendApis.profile_password_reset(resets)
                .subscribe(
                    response => {
                        this.old_password_error=false;
                        this.error_alert = false;
                        this.mismatch = false;
                        this.success_alert = true;
                        this.router.navigate(['home/dashboard']);
                    },

                    errors => {
                        this.mismatch = false;
                        this.success_alert = false;
                        this.error_alert = true;
                        this.old_password_error=true;
                        this.old_password_error = "Old password was not correct";

                    }

                )

        }

        else {
            this.old_password_error=false;
            this.mismatch = true;
            this.mismatch = "password were not equal";
            console.log("password fields did not match")
        }


    }

}
