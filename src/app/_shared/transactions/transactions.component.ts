import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Transaction } from "@app/_models/transaction";
import { AuthenticationService } from "@app/_services";
import { TransactionService } from "@app/_services/transaction.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
  styleUrls: ["./transactions.component.less"],
})
export class TransactionsComponent implements OnInit {
  loading = false;
  transactions: Transaction[];
  accountid = 12345;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private transactionService: TransactionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // console.log(this.route.snapshot.params);
    this.getTransactions(this.route.snapshot.params.accountid);
  }
  getTransactions(accountid: number) {
    this.loading = true;
    this.transactionService
      .getTransaction(accountid)
      .pipe(first())
      .subscribe((transactions) => {
        this.loading = false;
        this.transactions = transactions;
        console.log(transactions);
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
