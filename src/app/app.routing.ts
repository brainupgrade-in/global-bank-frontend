import { Routes, RouterModule } from "@angular/router";
import { CustomerComponent } from "./customer/customer.component";
import { DepositComponent } from "./customer/deposit/deposit.component";
import { StatementsComponent } from "./customer/statements/statements.component";
import { TransferComponent } from "./customer/transfer/transfer.component";
import { WithdrawComponent } from "./customer/withdraw/withdraw.component";
import { CreateComponent } from "./employee/create/create.component";
import { DashboardComponent } from "./employee/dashboard/dashboard.component";
import { EmployeeComponent } from "./employee/employee.component";

import { HomeComponent } from "./home";
import { LoginComponent } from "./login";
import { AuthGuard } from "./_helpers";
import { Role } from "./_models/roles";
import { AccountsComponent } from "./_shared/accounts/accounts.component";
import { CreateAccountComponent } from "./_shared/createaccount/createaccount.component";
import { TransactionsComponent } from "./_shared/transactions/transactions.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.EMPLOYEE] },
  },

  { path: "login", component: LoginComponent },

  {
    path: "customer/:customerid",
    component: CustomerComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.CUSTOMER] },
  },

  {
    path: "customer/:customerid/withdraw",
    component: WithdrawComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.CUSTOMER] },
  },

  {
    path: "customer/:customerid/transfer",
    component: TransferComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.CUSTOMER] },
  },

  {
    path: "customer/:customerid/deposit",
    component: DepositComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.CUSTOMER] },
  },

  {
    path: "customer/:customerid/transactions",
    component: TransactionsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.CUSTOMER] },
  },

  {
    path: "customer/:customerid/statements",
    component: StatementsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.CUSTOMER] },
  },

  
  {
    path: "customers/:customerid/accounts",
    component: AccountsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.CUSTOMER] },
  },

  {
    path: "employee",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.EMPLOYEE] },
  },

  {
    path: "employee/customers",
    component: EmployeeComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.EMPLOYEE] },
  },

  {
    path: "employee/customers/create-customer",
    component: CreateComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.EMPLOYEE] },
  },

  {
    path: "employee/customers/:customerid/accounts/:accountid/transactions",
    component: TransactionsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.EMPLOYEE] },
  },

  {
    path: "employee/customers/:customerid/accounts",
    component: AccountsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.EMPLOYEE] },
  },

  {
    path: "employee/customers/:customerid/accounts/create-account",
    component: CreateAccountComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.EMPLOYEE] },
  },

  // otherwise redirect to home
  { path: "**", redirectTo: "" },
];

export const appRoutingModule = RouterModule.forRoot(routes);
