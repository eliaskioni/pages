import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {Http, Headers} from '@angular/http';
import {contentHeaders} from "../services/headers";
import {BackendApis} from "../services/backend.apis";


// let styles   = require('./login.css');
// let template = require('./login.html');

@Component({
    selector: 'login',
    templateUrl: './login.html',
    styleUrls: ['./login.css']
})


export class Login {
    error: any;
    switch: boolean = true;
    success: any;
    message: any;
    email: any;
    email_holder: any;

    constructor(public router:Router, public http:Http, private apiService:BackendApis) {
    }

    login(event: any, username: any, password: any) {
        event.preventDefault();
        let body = JSON.stringify({username, password});
        // this.http.post('http://127.0.0.1:8080/api-token-auth/', body, { headers: contentHeaders })
        this.http.post(this.apiService.base_url+'/api-token-auth/', body, {headers: contentHeaders})
            .subscribe(
                response => {
                    localStorage.setItem('jwt', response.json().token);
                    this.router.navigate(['/home/dashboard']);
                },
                error => {
                    this.message = false;
                    let user = {'username': username}
                    this.apiService.checkUsername(user)
                        .subscribe(
                            resp => {
                                this.error = false;
                                this.email = true;
                                this.email = resp.json()
                                this.email_holder = this.email;
                            },

                            err => {
                                this.error = true
                                console.log('this was triggered')
                            }
                        )
                    console.log(error.text());
                }
            );
    }

    click(event: any) {
        event.preventDefault();
        this.switch = false;
        console.log('checker', this.switch)
    }

    signup(event: any) {
        event.preventDefault();
        this.router.navigate(['/homepage/sign-up']);
    }

    reset(event: any) {
        let email = this.email
        event.preventDefault();
        var resets = {}
        resets['email'] = email;
        // resets['new_password2']=password2;
        // console.log('one', password1);
        // console.log('two', password2);
        // console.log('passwords', resets);
        console.log('data', JSON.stringify(resets));
        this.apiService.reset_password(resets)
            .subscribe(
                response=> {
                    this.error = false;
                    this.email = false;
                    this.success = response.json();
                    console.log('success', this.success['success']);
                    // this.message = this.success['success']
                    this.message = 'Password reset link has been sent to ' + this.email_holder;
                    console.log('message', this.message)
                    console.log('response', response.json())
                },

                error=> {
                    console.log('error', error.json())
                }
            )
        // make username and password data into a dictionary

    }
}
