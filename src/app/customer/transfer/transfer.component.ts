import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Account } from "@app/_models/account";
import { AccountInput } from "@app/_models/accountinput";
import { TransactionInput } from "@app/_models/transactioninput";
import { AuthenticationService } from "@app/_services";
import { AccountService } from "@app/_services/account.service";
import { TransactionService } from "@app/_services/transaction.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-transfer",
  templateUrl: "./transfer.component.html",
})
export class TransferComponent implements OnInit {
  transferForm: FormGroup;
  sourceAccount = new AccountInput();
  targetAccount = new AccountInput();

  loading = false;
  submitted = false;
  returnUrl: string;
  error = "";
  accounts: Account[];
  toggle = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService,
    private accountService: AccountService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.transferForm = this.formBuilder.group({
      sourceaccountid: ["", Validators.required],
      targetaccountid: ["", Validators.required],
      amount: ["", Validators.required],
    });
    this.accountService
      .getCustAccounts(this.route.snapshot.params.customerid)
      .pipe(first())
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          this.error = error;
          this.loading = false;
        }
      );
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.transferForm.controls;
  }

  transfer() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.transferForm.invalid) {
      return;
    }

    this.loading = true;

    this.sourceAccount.accountId = this.f.sourceaccountid.value;
    this.targetAccount.accountId = this.f.targetaccountid.value;

    console.log(this.targetAccount);
    console.log(this.sourceAccount);

    this.transactionService
      .transfer(this.sourceAccount, this.targetAccount, this.f.amount.value)
      .pipe(first())
      .subscribe(
        (account) => {
          console.log(account);
          this.toggle = true;
          this.loading = false;
          this.router.navigate([
            "customer",
            this.route.snapshot.params.customerid,
          ]);
        },
        (error) => {
          this.error = error;
          this.loading = false;
        }
      );
  }

  deposit() {
    this.router.navigate(["deposit"], { relativeTo: this.route });
  }
  withdraw() {
    this.router.navigate(["withdraw"], { relativeTo: this.route });
  }
  viewTransactions() {
    this.router.navigate(["transactions"], { relativeTo: this.route });
  }
  viewStatements() {
    this.router.navigate(["statements"], { relativeTo: this.route });
  }

  getDashboard() {
    this.router.navigate(["/customer", this.route.snapshot.params.customerid]);
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }
}
