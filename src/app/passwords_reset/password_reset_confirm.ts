/**
 * Created by kioni on 4/21/16.
 */

import {Component, } from "@angular/core";
import { Router} from '@angular/router';
import { Http, Headers } from '@angular/http';
import {BackendApis} from "../services/backend.apis";
import { ActivatedRoute, Params } from '@angular/router';


@Component({
    selector: 'login',
    templateUrl: './password_reset_confirm.html',
    styleUrls: ['./login.css' ]

})

export class Reset{
    errors: any;
    token_expired: any;
    match_error: any;
    success: any;
    success_message: any;
    token: any;
    user_id: any;
    constructor(private http: Http, public router: Router, public backendApis: BackendApis, private route: ActivatedRoute ) {

    }


    get_reset_headers(){
        // var token: string = localStorage.getItem('jwt');
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        // headers.append("Authorization", "jwt "+token);
        return {headers: headers}
    }

    password_reset_confirm(resets: any) {
        let url = this.backendApis.base_url+'/rest-auth/password/reset/confirm/';
        let body = JSON.stringify(resets);
        // console.log(body);
        return this.http.post(url, body, this.get_reset_headers());
    }

    reset_error(){
        this.match_error=false;
        this.token_expired=false;
    }

    reset_password_confirm(event: any, password1: any, password2: any) {
        event.preventDefault();
        this.route.params.forEach((params: Params) => {
        // let id = params['user'];
            this.user_id = params['user'];
            this.token = params['token'];
  });

        let resets = {}
        resets['new_password1']=password1;
        resets['new_password2']=password2;
        resets['uid']=this.user_id;
        resets['token']=this.token;
        // console.log('token number', resets['token']);
        // console.log('resets', resets)
        let real = this.user_id +'/' + this.token;
        console.log(real);
        console.log(resets);
        this.password_reset_confirm(resets)
            .subscribe(
                response=> {
                    this.reset_error()
                    this.success= response.json();
                    if (this.success['success'])
                    // console.log('res', this.success)
                    this.router.navigate(['/homepage/login']);
                    // this.success_message = this.success['success'];
                    // this.router.parent.navigateByUrl('/login')
                },

                error=> {
                    this.reset_error();
                   this.errors = error.json();
                    console.log('elias err', error);
                    console.log(this.errors);
                    if (this.errors['token']) {
                        console.log('token error');
                        this.token_expired = this.errors['token'][0];
                    }

                    if (this.errors['new_password2']) {
                        this.match_error = this.errors['new_password2'][0];
                        console.log('elias');
                    }


                }

            )
    }


    homepage(event: any) {
        event.preventDefault();
        this.router.navigate(['homepage/welcome'])
    }





}
