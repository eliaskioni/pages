import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {Http} from '@angular/http';
import {contentHeaders} from "../../services/headers";
import {BackendApis} from "../../services/backend.apis";

declare var swal:any;
@Component({
    selector: 'sign-up-form',
    templateUrl: './signup.html',
    styleUrls: ['./signup.css'],
})

export class SignUpComponent {
    error: any;
    username_error: any;
    email_error: any;
    password1_error: any;
    password2_error: any;
    password_length_error: any;
    non_field_errors: any;
    activate_submit = false;
    load_spinner=false;

    constructor(public router:Router, public http:Http, public backendApis: BackendApis) {
    }

    signup(event: any, username: any, email: any, password1: any, password2: any) {
        this.load_spinner =true;
        event.preventDefault();
        let user_details = {};
        user_details['username'] = username;
        user_details['email'] = email;
        user_details['password1'] = password1;
        user_details['password2'] = password2;
        let body = JSON.stringify(user_details);
        // this.http.post(this.backendApis.base_url+'/rest-auth/registration/', body, {headers: contentHeaders})
        this.http.post(this.backendApis.base_url+'/rest-auth/registration/', body, {headers: contentHeaders})
            .subscribe(
                response => {
                    let login_body = {}
                    login_body['username'] = username;
                    login_body['password'] = password1;
                    let credentials = JSON.stringify(login_body)
                    this.http.post(this.backendApis.base_url+'/api-token-auth/', credentials, {headers: contentHeaders})
                        .subscribe(
                            response => {
                                this.load_spinner =false;
                                swal({
                                    title: 'Successful',
                                    text: 'Sign Up Successful Redirecting to dashboard',
                                    timer: 2500,
                                    showConfirmButton: false,
                                    type: 'success'
                                });
                                localStorage.setItem('jwt', response.json().token);
                                this.router.navigate(['/home/dashboard']);
                            },
                            error => {
                                this.error = true;
                                console.log(error.text());
                            }
                        );
                    // localStorage.setItem('jwt', response.json().id_token);
                },
                error => {
                    swal({
                        title: 'Error',
                        text: 'SignUp Failure, correct highlighted errors and try again.',
                        type: 'error'
                    });
                    this.load_spinner =false;
                    this.error=error.json();
                    this.username_error = this.error['username'];
                    this.email_error = this.error['email'];
                    this.password1_error = this.error['password1'];
                    this.password2_error = this.error['password2'];
                    this.non_field_errors = this.error['non_field_errors'];
                    console.log('non field errors', this.non_field_errors)
                    if (!this.password2_error) {
                        console.log('not equal');
                    }
                    console.log(this.error);
                    console.log('elias', this.error['password1']);
                    console.log('username', this.username_error);
                    console.log('pas 1', this.password1_error);
                    console.log('pas 2', this.password2_error);
                    console.log('email err', this.email_error);
                }
            );
    }

    activate_button(event: any) {
        event.preventDefault();
        if (this.activate_submit == false) {
            this.activate_submit = true;
        }
        else {
            this.activate_submit = false;
        }
    }

    login(event: any) {
        event.preventDefault();
        this.router.navigate(['/homepage/login']);
    }

    terms_conditions(event:any) {
        event.preventDefault();
        this.router.navigate(['/homepage/terms_and_condition']);
    }

}
