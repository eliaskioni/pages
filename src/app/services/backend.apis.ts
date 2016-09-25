/**
 * Created by francis on 13/04/2016.
 */

import {Http, Headers} from "@angular/http";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {contentHeaders} from "./headers";

@Injectable()
export class BackendApis {

    // base_url = "http://lb.tumacredo-stag.a087b769.svc.dockerapp.io:9000";
    // base_url = 'http://127.0.0.1:8085';
    base_url = window.location.origin;

    scheme = window.location.protocol == "https:" ? "wss" : "ws";
    ws_scheme = this.scheme + "://";
    ws_base_url = this.ws_scheme + window.location.host;

    local_host_name = ["localhost", "127.0.0.1", "192.168.99.100"];


    constructor(public router:Router, public http:Http) {

            if (this.local_host_name.indexOf(window.location.hostname) > -1){
                this.base_url = window.location.protocol + "//" + window.location.hostname + ":8080";
                this.ws_base_url = this.ws_scheme + window.location.hostname + ":8080";
            }
    }

    get_headers() {
        var token:string = localStorage.getItem('jwt');
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("Authorization", "jwt " + token);
        return {headers: headers}
    }

    get_reset_headers() {
        // var token: string = localStorage.getItem('jwt');
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        // headers.append("Authorization", "jwt "+token);
        return {headers: headers};
    }

    get_contacts() {
        let url = this.base_url + '/api_v1/contact/';
        return this.http.get(url, this.get_headers());
    }

    get_user() {
        let url = this.base_url + '/rest-auth/user';
        return this.http.get(url, this.get_headers());
    }
    
    get_balance(){
        let url = this.base_url + '/api_v1/check_balance/';
        return this.http.get(url, this.get_headers());
    }

    send_airtime(airtime_recipient: any) {
        let url = this.base_url + '/api_v1/send_airtime/';
        let body = JSON.stringify(airtime_recipient);
        // console.log("body:" + body);
        // console.log("recipeint:" + airtime_recipient);
        return this.http.post(url, body, this.get_headers())
    }

    send_message(message_recipients: any) {
        let url = this.base_url + '/api_v1/send_sms';
        let body = JSON.stringify(message_recipients);
        return this.http.post(url, body, this.get_headers())
    }

    get_sent_sms() {
        let url = this.base_url + '/api_v1/user-sent-sms-api';
        return this.http.get(url, this.get_headers());
    }

    get_airtime_report() {
        let url = this.base_url + '/api_v1/recent_transaction/';
        return this.http.get(url, this.get_headers());
    }

    getAirtimeReport(page=1) {
        let url = this.base_url + '/api_v1/transactions?page=' + page;
        return this.http.get(url, this.get_headers());
    }

    reset_password(resets: any) {
        let url = this.base_url + '/rest-auth/password/reset/';
        let body = JSON.stringify(resets);
        console.log(body);
        return this.http.post(url, body, this.get_reset_headers());
    }

    password_reset_confirm(resets: any) {
        let url = this.base_url + '/rest-auth/password/reset/confirm/';
        let body = JSON.stringify(resets);
        console.log(body);
        return this.http.post(url, body, this.get_reset_headers());
    }

    createGroup(group: any) {
        let url = this.base_url + '/api_v1/create_group/';
        console.log('type of group', typeof group);
        console.log(group);
        let body = JSON.stringify(group);
        return this.http.post(url, body, this.get_headers());
    }

    getGroups() {
        let url = this.base_url + '/api_v1/user_contacts_group';
        return this.http.get(url, this.get_headers())
    }

    getDashboardAirtimeTransactions(){
        let url = this.base_url + '/api_v1/dashboard_airtime';
        return this.http.get(url, this.get_headers())
    }

    getDashboardSMSTransactions(){
        let url = this.base_url + '/api_v1/dashboard_sms';
        return this.http.get(url, this.get_headers())
    }

    getDashboardMessagesTransactionsSum(){
        let url = this.base_url + '/api_v1/messages_transactions_count';
        return this.http.get(url, this.get_headers())
    }

    getDashboardAirtimeTransactionSum(){
        let url = this.base_url + '/api_v1/total_airtime_sent';
        return this.http.get(url, this.get_headers())
    }
    
    getDashboardAirtimeTransactionsDoneSum(){
        let url = this.base_url + '/api_v1/airtime_transactions_count';
        return this.http.get(url, this.get_headers())
    }

    addContact(data: any) {
        let url = this.base_url + '/api_v1/contact/';
        let body = JSON.stringify(data);
        return this.http.post(url, body, this.get_headers());
    }

    addBulkContact(data: any) {
        let url = this.base_url + '/api_v1/upload_bulk_excel_contact';
        console.log('end', data);
        let body = JSON.stringify(data);
        console.log('body string: ', body);
        return this.http.post(url, body, this.get_headers());
    }
    
    updateContact(data: any) {
        let url = this.base_url + '/api_v1/contact/' + data["pk"] + '/';
        let body = JSON.stringify(data);
        console.log('body', body);
        return this.http.put(url, body, this.get_headers());
    }

    logout(){
        localStorage.removeItem('jwt');
        this.router.navigate(["/homepage/welcome"])
    }
    

    check_if_logged_in() {
        return !!localStorage.getItem('jwt');
        
    }

    previous(previous_url: any) {
        console.log('previous items');
        return this.http.get(previous_url, this.get_headers());

    }
    
    next(next_url: any) {
        console.log('next items');
        return this.http.get(next_url, this.get_headers());
        
    }
    
    update_user(data: any) {
        let url  = this.base_url + '/edit_user';
        let body = JSON.stringify(data);
        return this.http.post(url, body, this.get_headers());
    }
    
    get_simple_user() {
        let url = this.base_url + '/rest-auth/user/';
        return this.http.get(url, this.get_headers());
    }
    
    profile_password_reset(resets: any) {
        let body = JSON.stringify(resets);
        let url = this.base_url + '/api_v1/change_password';
        return this.http.post(url, body, this.get_headers());
    }
    
    edit_user(details: any) {
        let body = JSON.stringify(details);
        console.log(body);
        let url = this.base_url + '/api_v1/edit_user';
        return this.http.post(url, body, this.get_headers());
    }
    
    check_balance() {
        let url = this.base_url + '/api_v1/check_balance/';
        return this.http.get(url, this.get_headers())
    }

    setjwt() {
        let url = this.base_url+'/api-token-refresh/';
        let body = localStorage.getItem('jwt');
        let token = {};
        token['token'] = body;
        console.log('token', body);
        return this.http.post(url, JSON.stringify(token), {headers: contentHeaders});
    }

    deleteContactApi(pk: any){
        let url = this.base_url + '/api_v1/contact/'+pk+'/';
        return this.http.delete(url, this.get_headers());
    }

    deleteGroupApi(pk: any){
        let url = this.base_url + '/api_v1/group/'+pk+'/';
        return this.http.delete(url, this.get_headers());
    }
    
    filterAirtimeTransactions(daterange: any){
        let url=this.base_url+'/api_v1/transactions?daterange='+daterange;
        return this.http.get(url,this.get_headers());
    }

    filterSMSTransactions(daterange: any){
        let url=this.base_url+'/api_v1/user-sent-sms-api?daterange='+daterange;
        return this.http.get(url,this.get_headers());
    }
    
    checkUsername(username: any) {
        let url = this.base_url + '/api_v1/username';
        let body= JSON.stringify(username);
        return this.http.post(url, body, this.get_reset_headers())
    }
    
    get_account_message_id() {
        let url = this.base_url + '/api_v1/sender_id/';
        return this.http.get(url, this.get_headers())
    }
    
    get_contact(pk: any) {
        let url = this.base_url + '/api_v1/contact/' + pk + '/'
        return this.http.get(url, this.get_headers())
    }

    getGroupContact(pk: any) {
        let url = this.base_url + '/api_v1/contact/?group_set=' + pk;
        return this.http.get(url, this.get_headers())
    }

    get_transactions(pk: any){
        let url=this.base_url+'/api_v1/transactions/?pk='+pk;
        return this.http.get(url,this.get_headers());
    }
    
    get_accounting_data(date_range: any) {
        let url = this.base_url + '/api_v1/account_statement/?daterange='+date_range;
        return this.http.get(url, this.get_headers());
    }

}