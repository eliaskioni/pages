import {Routes, RouterModule} from "@angular/router";
import {BillingComponent} from "./billing/Billing";
import {Contacts} from "./contacts/contacts";
import {AddContactComponent} from "./contacts/add-contacts/add-contact";
import {AddContactsExcelComponent} from "./contacts/add-contacts-excel/add-contacts-excel";
import {AddGroupComponent} from "./contacts/add-group/add-group";
import {MessageContact} from "./contacts/send-message/message";
import {QuickSMSComponent} from "./sms/quick-sms/quick-sms";
import {ExcelSMSComponent} from "./sms/excel-sms/excel-sms";
import {ContactsSMSComponent} from "./sms/contacts-sms/contacts-sms";
import {ReportsSMSComponent} from "./sms/reports/report-sms";
import {ReportsTopupComponent} from "./airtime/reports/reports-topup";
import {Thanks} from "./thanks/thanks";
import {Accounting} from "./accounting/account";
import {ExcelTopupComponent} from "./airtime/excel-topup/excel-topup";
import {BulkTopupComponent} from "./airtime/bulk-topup/bulk-topup";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ModuleWithProviders} from "@angular/core";
import {Home} from "./home";
import {QuickTopupComponent} from "./airtime/quick-topup/quick-topup";
import {ChangePassword} from "../settings/Change/change_password";
import {ProfileInfo} from "../settings/Profile_info/profile";
import {EditProfile} from "../settings/Edit_details/edit_profile";
import {Settings} from "../settings/settings";
/**
 * Created by kioni on 9/5/16.
 */

export const routes: Routes =[
  {path: 'home', component: Home,
  children: [
    {
        path: 'billing',
        component: BillingComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'contacts',
        component: Contacts,
    },
    {
        path: 'contacts/add-contact',
        component: AddContactComponent
    },
    {
        path: 'contacts/add-contacts-excel',
        component: AddContactsExcelComponent
    },
    {
        path: 'contacts/add-group',
        component: AddGroupComponent
    },
    {
        path: 'contacts/send-message',
        component: MessageContact
    },
    {
        path: 'sms/quick-sms',
        component: QuickSMSComponent
    },
    {
        path: 'sms/excel-sms',
        component: ExcelSMSComponent
    },
    {
        path: 'sms/contacts-sms',
        component: ContactsSMSComponent
    },
    {
        path: 'sms/reports-sms',
        component: ReportsSMSComponent
    },
    {
        path: 'airtime/quick-topup',
        component: QuickTopupComponent
    },
    {
        path: 'airtime/bulk-topup',
        component: BulkTopupComponent
    },
    {
        path: 'airtime/excel-topup',
        component: ExcelTopupComponent
    }, {
        path: 'airtime/airtime-reports',
        component: ReportsTopupComponent
    },
    {
        path: 'thanks',
        component: Thanks
    },
    {
        path: 'accounting',
        component: Accounting
    },

  ]},
  { path: '', redirectTo: '/home/dashboard', pathMatch: 'full' },
  { path: 'settings', component: Settings,
    children: [
      {path:  'edit_profile', component: EditProfile},
    {path:  'profile', component: ProfileInfo},
    {path:  'change_password', component: ChangePassword}
    ]}
];

export const appRoutingProviders: any[] = [];
export const homerouting: ModuleWithProviders = RouterModule.forChild(routes);

