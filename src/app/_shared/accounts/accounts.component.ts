import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Account } from "@app/_models/account";
import { AuthenticationService } from "@app/_services";
import { AccountService } from "@app/_services/account.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-accounts",
  templateUrl: "./accounts.component.html",
  styleUrls: ["./accounts.component.less"],
})
export class AccountsComponent implements OnInit {
  loading = false;
  accounts: Account[];
  customerid: string;

  constructor(private accountService: AccountService, private authenticationService: AuthenticationService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // console.log(this.route.snapshot.params);
    this.getAccounts(this.route.snapshot.params.customerid);
    this.customerid = this.route.snapshot.params.customerid;
  }

  getAccounts(customerid: string) {
    this.loading = true;

    this.accountService
      .getCustAccounts(customerid)
      .pipe(first())
      .subscribe((accounts) => {
        this.loading = false;
        this.accounts = accounts;

        console.log(accounts);
      });
  }

  viewTransactions(accountid: string) {
    this.router.navigate([`${accountid}`, "transactions"], {
      relativeTo: this.route,
    });
  }

  createAccount() {
    console.log(this.route.snapshot);
    this.router.navigate(["create-account"], {
      relativeTo: this.route,
    });
  }


  getDashboard() {
    this.router.navigate(["/employee"]);
  }
  getCustomers() {
    this.router.navigate(["/employee/customers"]);

  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }

}
