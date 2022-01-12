import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { appRoutingModule } from "./app.routing";

import { JwtInterceptor, ErrorInterceptor } from "./_helpers";
import { HomeComponent } from "./home";
import { LoginComponent } from "./login";
import { CustomerComponent } from "./customer/customer.component";
import { EmployeeComponent } from "./employee/employee.component";
import { WithdrawComponent } from "./customer/withdraw/withdraw.component";
import { DepositComponent } from "./customer/deposit/deposit.component";
import { TransferComponent } from "./customer/transfer/transfer.component";
import { StatementsComponent } from "./customer/statements/statements.component";
import { StatementComponent } from "./customer/statements/statement/statement.component";
import { CreateComponent } from "./employee/create/create.component";
import { AccountsComponent } from "./_shared/accounts/accounts.component";
import { TransactionsComponent } from "./_shared/transactions/transactions.component";
import { CreateAccountComponent } from "./_shared/createaccount/createaccount.component";
import { DashboardComponent } from './employee/dashboard/dashboard.component'

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    appRoutingModule,
  ],

  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CustomerComponent,
    WithdrawComponent,
    DepositComponent,
    TransferComponent,
    StatementsComponent,
    StatementComponent,
    EmployeeComponent,
    StatementComponent,
    CreateComponent,
    AccountsComponent,
    TransactionsComponent,
    CreateAccountComponent,
    DashboardComponent
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
