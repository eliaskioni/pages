import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';
import {routing, appRoutingProviders} from "./app.routing";
import {HttpModule, Http, XHRBackend, RequestOptions}    from '@angular/http';
import {AuthHttp, JwtHelper, AuthConfig, AUTH_PROVIDERS, provideAuth} from 'angular2-jwt';

import {AppComponent} from "./app.component";
import {Home} from "./home/home";
import {BillingComponent} from "./home/billing/Billing";
import {DashboardComponent} from "./home/dashboard/dashboard.component";
import {Contacts} from "./home/contacts/contacts";
import {AddContactComponent} from "./home/contacts/add-contacts/add-contact";
import {AddContactsExcelComponent} from "./home/contacts/add-contacts-excel/add-contacts-excel";
import {AddGroupComponent} from "./home/contacts/add-group/add-group";
import {MessageContact} from "./home/contacts/send-message/message";
import {QuickSMSComponent} from "./home/sms/quick-sms/quick-sms";
import {ExcelSMSComponent} from "./home/sms/excel-sms/excel-sms";
import {ContactsSMSComponent} from "./home/sms/contacts-sms/contacts-sms";
import {ReportsSMSComponent} from "./home/sms/reports/report-sms";
import {QuickTopupComponent} from "./home/airtime/quick-topup/quick-topup";
import {BulkTopupComponent} from "./home/airtime/bulk-topup/bulk-topup";
import {ExcelTopupComponent} from "./home/airtime/excel-topup/excel-topup";
import {ReportsTopupComponent} from "./home/airtime/reports/reports-topup";
import {Thanks} from "./home/thanks/thanks";
import {Accounting} from "./home/accounting/account";
import {AboutUs} from "./homepage/aboutUs/About";
import {ContactUsComponent} from "./homepage/contact-us/contact-us";
import {FAQComponent} from "./homepage/faq/faq";
import {HowToComponent} from "./homepage/how-to/how-to";
import {PricingComponent} from "./homepage/pricing/pricing";
import {WhyUsComponent} from "./homepage/why-us/why-us";
import {LandingPageComponent} from "./homepage/landing-page/landing-page";
import {Login} from "./login/login";
import {SignUpComponent} from "./signup/sign-up/signup";
import {TermsAndConditionsComponent} from "./terms_and_conditions/terms_and_conditions";
import {Homepage} from "./homepage/homepage";
import {LoadingIndicator} from "./loading_indicator/loading_indicator";
import {Notification} from "./notifications/notifications-model";
import {Notifications} from "./notifications/notification-component";
import {SearchBox} from "./home/search-box";
import {FormatDatePipe} from "./home/airtime/reports/date-pipe";
import {SearchContactList} from "./home/contacts/contacts-pipe";
import {MultipleGroupSelect} from "./home/contacts/select_group";
import {ReportSearch} from "./home/airtime/reports/report-search";
import {SMSearchBox} from "./home/sms/reports/sms-report-box";
import {DateSearch} from "./home/date-search";
import {BoldDirective} from "./unsupported_directives";
import {Settings} from "./settings/settings";
import {BillingPreLoader} from "./home/billing/billing-loader";
import {EditProfile} from "./settings/Edit_details/edit_profile";
import {ProfileInfo} from "./settings/Profile_info/profile";
import {ChangePassword} from "./settings/Change/change_password";
import {BackendApis} from "./services/backend.apis";
import {UserDataService} from "./home/models";
import {NotificationsService} from "./notifications/notification-service";
import {TopUpService} from "./services/excel-top-up-service";
import {ContactsService} from "./services/contacts-service";
import {Reset} from "./passwords_reset/password_reset_confirm";


@NgModule({
  imports:      [
      BrowserModule,
      routing,
      FormsModule,
      HttpModule,
  ],
  declarations: [
          Home,
    BillingComponent,
    DashboardComponent,
    Contacts,
    AddContactComponent,
    AddContactsExcelComponent,
    AddGroupComponent,
    MessageContact,
    QuickSMSComponent,
    ExcelSMSComponent,
    ContactsSMSComponent,
    ReportsSMSComponent,
    QuickTopupComponent,
    BulkTopupComponent,
    ExcelTopupComponent,
    ReportsTopupComponent,
    Thanks,
    Accounting,
    AboutUs,
    ContactUsComponent,
    FAQComponent,
    HowToComponent,
    PricingComponent,
    WhyUsComponent,
    LandingPageComponent,
    Login,
    SignUpComponent,
    TermsAndConditionsComponent,
    Homepage,
    AppComponent,
      LoadingIndicator,
      Notifications,
      SearchBox,
      FormatDatePipe,
      SearchContactList,
      MultipleGroupSelect,
      ReportSearch,
      SMSearchBox,
      DateSearch,
      BoldDirective,
      Settings,
      BillingPreLoader,
      EditProfile,
      ProfileInfo,
      ChangePassword,
      Reset
      ],
  providers: [
      BackendApis,
      UserDataService,
      AuthHttp,
      Notifications,
      appRoutingProviders,
      NotificationsService,
      TopUpService,
      ContactsService,
      provideAuth({
        headerName: 'Authorization',
        headerPrefix: 'jwt',
        tokenName: 'jwt',
        tokenGetter: (() => localStorage.getItem('jwt')),
        globalHeaders: [{'Content-Type': 'application/json'}],
        noJwtError: true
      })
  ],
  entryComponents: [AppComponent],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }