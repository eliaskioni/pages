/**
 * Created by kioni on 5/18/16.
 */
import {Component} from "@angular/core";
import {BackendApis} from "../../services/backend.apis";
import {Router} from "@angular/router";
@Component({
    templateUrl: './edit_profile.html'

})

export class EditProfile{
    css_modifier: any;
    res_username: any;
    res_email: any;
    success_alert: any;
    error_alert: any;
    constructor(public router:Router, private backendApis: BackendApis) {
        this.submit()

    }
    submit() {
        // event.preventDefault();
        this.backendApis.get_simple_user()
            .subscribe(
                response => {
                    let res = response.json();
                    this.res_username = res['username'];
                    this.res_email = res['email'];
                    console.log(response, typeof response);
                    console.log(this.res_username)
                },
                errors => {
                    console.log(errors)
                }

            )

    }
    update_func(event: any, username: any, email: any) {
        event.preventDefault();
        var dict = {};
        if (username.length > 0) {
            dict['username'] = username;
        };
        if (email.length > 0) {
            dict['email'] = email;
        }

        if (username.length > 4 && email.length > 7) {
            console.log('email', email)
            this.backendApis.edit_user(dict)
                .subscribe(
                    response => {
                        // console.log(response.json())
                        /* tokens are made using username
                         * changing username invalidates the token
                          * have to reset it again here*/
                        localStorage.setItem('jwt', response.json());
                        this.router.navigate(['/home/dashboard']);
                        // console.log(response);
                        this.error_alert = false;
                        this.success_alert = true;
                    },

                    error => {
                        console.log(error);
                        this.success_alert = false;
                        this.error_alert = true;
                        this.error_alert = error._body.replace(/"/g, "");

                    }
                )

        }
        else{
            this.css_modifier = true;
        }

    }
}
