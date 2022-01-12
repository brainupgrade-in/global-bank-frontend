import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '@app/_models/account';
import { Transaction } from '@app/_models/transaction';
import { AuthenticationService } from '@app/_services';
import { AccountService } from '@app/_services/account.service';
import { TransactionService } from '@app/_services/transaction.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html'
})
export class StatementsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService, private acountService: AccountService, private transactionService: TransactionService) { }

  transactions: Transaction[];
  customerid: string;
  accounts: Account[] = [];

  ngOnInit(): void {
    this.viewStatements();
    setTimeout(() => {
      console.log("Called Transactions")
      this.accounts.forEach(account => {
        this.transactionService.getTransaction(account.accountId).pipe(first()).subscribe((transactions) => {
          this.transactions = transactions;
        })
      });
    }, 1000);

  }

  viewStatements() {
    this.customerid = this.route.snapshot.params.customerid;
    console.log("Called Accounts");
    this.acountService.getCustAccounts(this.customerid).pipe(first()).subscribe((accounts) => {
      this.accounts = accounts;
    })
  }

  deposit() {

    this.router.navigate(["deposit"], { relativeTo: this.route });
  }
  withdraw() {

    this.router.navigate(["withdraw"], { relativeTo: this.route });
  }

  transfer() {
    this.router.navigate(["transfer"], { relativeTo: this.route });

  }
  getDashboard() {
    this.router.navigate(["/customer", this.route.snapshot.params.customerid]);
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }

}
