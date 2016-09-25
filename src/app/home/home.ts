import {Component, ViewEncapsulation, OnInit, enableProdMode} from "@angular/core";
import {Router} from "@angular/router";
import {BackendApis} from "../services/backend.apis";
import {Observable} from "rxjs/Observable";
import {UserModel, UserDataService} from "./models";
import {JwtHelper} from "angular2-jwt";
enableProdMode();


@Component({
    selector: 'home',
    templateUrl: './home.html',
    styleUrls: [
        './sb-admin.css',
        './morris.css',
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [UserDataService]
})
export class Home implements OnInit {
    userData: UserModel = new UserModel();
    jwtHelper: any = new JwtHelper();
    constructor(public router:Router,
                public backendApis:BackendApis,
                private userDataService: UserDataService
    ) {
    console.log("home constructor");
    }

    //I moved everything to this ngOnInit so that constructor loads easily
    ngOnInit() {
        let jwt = localStorage.getItem("jwt");
        console.log("jwt:"+jwt);
        // console.log("token expired:" + this.jwtHelper.isTokenExpired(jwt));
        if (jwt == null){
            console.log("login failed");
            this.router.navigate(['/homepage/login']);
        }else{
            let decodedJwt = this.jwtHelper.decodeToken(jwt);
            this.userData.username = decodedJwt.username;
            this.webSocketConnect();

            var source = Observable.forkJoin(
            this.backendApis.getDashboardAirtimeTransactionSum(),
            this.backendApis.getDashboardMessagesTransactionsSum(),
            this.backendApis.getDashboardAirtimeTransactions(),
            this.backendApis.getDashboardSMSTransactions(),
            this.backendApis.getDashboardAirtimeTransactionsDoneSum()
        ).subscribe(
            (data: any)=> {

                //user's airtime transaction sum
                if (data[0].json().amount__sum===null) // if user has no transaction, sum will return null. set it to 0
                    this.userData.airtime_transactions_done = 0;
                else
                    this.userData.airtime_transactions_done = data[0].json().amount__sum;

                //user's sent sms sum
                this.userData.sms_count = data[1].json();

                //user's airtime transactions
                // this.airtime_transactions.splice(0, this.airtime_transactions.length); //reset the list to be empty
                this.userData.update_airtime_transaction_via_api_data(data[2].json(),
                    "recent_airtime_transaction");

                //user's sms transactions
                this.userData.update_sms_transactions_via_api_data(data[3].json(),
                    "recent_sms_transaction")
                this.userData.airtime_transactions_done_sum = data[4].json();

                this.userDataService.announceDataChange(this.userData);
            },
            (error)=> {
                // todo: incase of error repeat the requests again.
                console.log("Error during polling: ", error.json().detail);
            },
            ()=> {
            });
        }
    }

    logout() {
        localStorage.removeItem('jwt');
        this.router.navigate(['/homepage/welcome'])
    }

    webSocketConnect() {

        var ws_path = this.backendApis.ws_base_url + "/user/data/binding/" + this.userData.username + "/stream/";
        console.log("Connecting to " + ws_path);
        let  ws = new WebSocket(ws_path);

        ws.onerror = (evt) => console.log('Error');

        ws.onmessage = (evt) => this.weSocketMessage(evt.data);

        ws.onclose = (evt) => this.webSocketClose();
        // this.ws.onopen = (evt) => this.weSocketMessage(evt.data);
    }

    webSocketClose() {
        console.log('Closed');
        setTimeout(function() {
        }, 1000);  // 1 seconds timeout
        this.webSocketConnect();
    }

    weSocketMessage(data: any) {
        console.log("data:"+ data);
        this.userData.update(data);
        this.userDataService.announceDataChange(this.userData);
    }

}

