import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

export class UserModel{
    balance: number = 0;
    username: string;

    recent_airtime_transaction: Array<any> = [];
    airtime_transactions: Array<any> = [];

    recent_sms_transactions: Array<any> = [];
    sms_transactions: Array<any> = [];


    sms_count: any;
    airtime_transactions_done: any;
    airtime_transactions_done_sum: any;



    update(data: any){
        data = JSON.parse(data);
        // example of data we are expecting.
        //{"payload": {"action": "update", "pk": 3, "model": "core.account", "data": {"balance": "50"}}, "stream": "account_balance"}
        let payload = data.payload;
        let stream = data.stream;

        // call the appropriate handler depending on stream
        this.route_handler(stream, payload)

    }

    route_handler(stream: any, payload: any){
        switch (stream){
            case "account_balance":
                this.account_balance_handler(payload);
                break;
            case "airtime_recipient":
                this.airtime_transaction_handler(payload);
                break;
            case "sms_recipient":
                this.sms_transaction_handler(payload);
                break;
            default:
                throw new Error(stream + "not supported");
        }
    }

    account_balance_handler(payload: any){
        // expecting this kind of payload
        //{"action": "update", "pk": 3, "model": "core.account", "data": {"balance": "50"}}

        // get data
        this.balance = payload.data.balance;
    }


    update_airtime_transaction_via_api_data(data: any, name: any){

        // get results
        let results = data.results;

        for (var transaction of results){
            for (var recipients of transaction.recipient_transactions){
                if ( name == "recent_airtime_transaction"){
                    this.recent_airtime_transaction.push(recipients);
                }else{
                    this.airtime_transactions.push(recipients);
                }
            }
        }
    }

    update_sms_transactions_via_api_data(data: any,name: any){
        let results = data.results;

        for (var transaction of results){
            if (name == "recent_sms_transaction"){
                this.recent_sms_transactions.push(transaction);
            }else {
                this.sms_transactions.push(transaction)
            }
        }
    }

    airtime_transaction_handler(payload: any){
        // expecting this payload
        // data:{"payload": {"action": "create", "pk": 6, "model": "core.recipients", "data": {"phone_number": "254702729654", "status": "received", "transactions": 6, "created_at": "2016-08-14T09:23:26.940Z", "error_message": null, "amount_sent": null, "updated_at": "2016-08-14T09:23:26.940Z", "amount": "10", "names": "", "request_id": null}}, "stream": "airtime_recipient"}
        let action = payload.action;
        let id = payload.pk;

        if (action == "create"){
            let new_data = payload.data;
            new_data['id'] = id;
            this.recent_airtime_transaction.unshift(new_data);
            this.airtime_transactions.unshift(new_data);
        }else if (action == "update"){
            // update recent transactions
            for (let index in this.recent_airtime_transaction){
                let transaction = this.recent_airtime_transaction[index];
                if (transaction.id == id){
                    // update the transaction
                    let new_data = payload.data;
                    new_data['id'] = id;
                    this.recent_airtime_transaction[index] = new_data;

                    if (new_data.status == "success"){
                        this.airtime_transactions_done += 1;
                        this.airtime_transactions_done_sum += 1;
                    }
                }
            }

            //update airtime transactions
            for (let index in this.airtime_transactions){
                let transaction = this.airtime_transactions[index];
                if (transaction.id == id){
                    let new_data = payload.data;
                    new_data['id'] = id;
                    // update the transaction
                    this.airtime_transactions[index] = payload.data;
                }
            }
        }
    }

    sms_transaction_handler(payload: any){
        // expecting this payload
        // data:{"payload": {"action": "create", "pk": 6, "model": "core.recipients", "data": {"phone_number": "254702729654", "status": "received", "transactions": 6, "created_at": "2016-08-14T09:23:26.940Z", "error_message": null, "amount_sent": null, "updated_at": "2016-08-14T09:23:26.940Z", "amount": "10", "names": "", "request_id": null}}, "stream": "airtime_recipient"}
        let action = payload.action;
        let id = payload.pk;

        if (action == "create"){
            let new_data = payload.data;
            new_data['id'] = id;
            this.recent_sms_transactions.unshift(new_data);
            this.sms_transactions.unshift(new_data);
        }else if (action == "update"){
            // update recent transactions
            for (let index in this.recent_sms_transactions){
                let transaction = this.recent_sms_transactions[index];
                if (transaction.id == id){
                    // update the transaction
                    let new_data = payload.data;
                    new_data['id'] = id;
                    this.recent_sms_transactions[index] = new_data;

                    if (new_data.status == "success"){
                        this.sms_count += 1;
                    }
                }
            }

            //update airtime transactions
            for (let index in this.sms_transactions){
                let transaction = this.sms_transactions[index];
                if (transaction.id == id){
                    let new_data = payload.data;
                    new_data['id'] = id;
                    // update the transaction
                    this.sms_transactions[index] = new_data;
                }
            }
        }
    }
}

@Injectable()
export class UserDataService {
    private userData = new Subject<UserModel>();

      // Observable string streams
    dataChangeAnnounced$ = this.userData.asObservable();

    // Service message commands
    announceDataChange(userData: UserModel) {
        this.userData.next(userData);
    }
}
