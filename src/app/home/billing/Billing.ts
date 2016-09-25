import {Component, forwardRef, Inject} from "@angular/core";
import {BackendApis} from "../../services/backend.apis";
import {BillingPreLoader} from "./billing-loader";
import {UserDataService, UserModel} from "../models";
import {Home} from "../home";
/**
 * Created by francis on 12/04/2016.
 */

@Component({
    selector:'billing',
    templateUrl: './billing.html',
    styleUrls:[
        './billing.css'
    ],
    providers: [UserDataService]
})
export class BillingComponent{
    userData = new UserModel();
    constructor( public backendApis: BackendApis,
                 @Inject(forwardRef(() => Home)) home: Home) {
        this.userData = home.userData;
    }

}
