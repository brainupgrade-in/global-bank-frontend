import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Account } from "@app/_models/account";
import { AccountCreationStatus } from "@app/_models/accountCreationStatus";
import { AccountInput } from "@app/_models/accountinput";
import { AuthenticationService } from "@app/_services";
import { AccountService } from "@app/_services/account.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-createaccount",
  templateUrl: "./createaccount.component.html",
  styleUrls: ["./createaccount.component.less"],
})
export class CreateAccountComponent implements OnInit {
  createAccountForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = "";
  status: AccountCreationStatus;
  createdAccount = new Account();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.createAccountForm = this.formBuilder.group({
      accountId: ["", Validators.required],
      accountType: ["", Validators.required],
      ownerName: ["", Validators.required],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.createAccountForm.controls;
  }

  createAccount() {
    this.loading = true;
    this.submitted = true;
    // stop here if form is invalid
    if (this.createAccountForm.invalid) {
      return;
    }

    this.createdAccount.accountId = this.f.accountId.value;
    this.createdAccount.accountType = "Savings";
    this.createdAccount.currentBalance = 2000.0;
    this.createdAccount.customerId = this.route.snapshot.params.customerid;
    this.createdAccount.ownerName = this.f.ownerName.value;
    console.log(this.createdAccount);

    this.accountService
      .createAccount(
        this.route.snapshot.params.customerid,
        this.f.accountId.value,
        this.route.snapshot.params.customerid,
        2000.0,
        this.f.accountType.value,
        this.f.ownerName.value
      )
      .pipe(first())
      .subscribe((status) => {
        this.status = status;
        console.log(status);
        this.router.navigate([
          `employee/customers/${this.route.snapshot.params.customerid}/accounts`,
        ]);
      }, (error) => {
        this.error = error;
        this.loading = false;
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
