import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Customer } from "@app/_models/customer";
import { AuthenticationService } from "@app/_services";
import { CustomerService } from "@app/_services/customer.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.less"],
})
export class CreateComponent implements OnInit {
  customerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = "";
  customer: Customer;
  createdCustomer: Customer;
  isLoaded = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.customerForm = this.formBuilder.group({
      userid: ["", Validators.required],
      username: ["", Validators.required],
      password: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      address: ["", Validators.required],
      pan: ["", Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.customerForm.controls;
  }

  createCustomer() {
    this.submitted = true;
    this.loading = true;
    this.customerService
      .createCustomer(
        this.f.userid.value,
        this.f.username.value,
        this.f.password.value,
        this.f.dateOfBirth.value,
        this.f.pan.value,
        this.f.address.value
      )
      .pipe(first())
      .subscribe((createdCustomer) => {
        this.loading = false;
        console.log(createdCustomer);
        this.router.navigate(["/employee/customers"]);
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
