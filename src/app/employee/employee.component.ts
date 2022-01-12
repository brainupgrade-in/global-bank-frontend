import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Customer } from "@app/_models/customer";
import { AuthenticationService } from "@app/_services";
import { CustomerService } from "@app/_services/customer.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-employee",
  templateUrl: "./employee.component.html",
})
export class EmployeeComponent implements OnInit {
  loading = false;
  customers: Customer[];
  idForm: FormGroup;
  customer: Customer;
  submitted = false;
  returnUrl: string;
  error = "";
  isLoaded = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.idForm = this.formBuilder.group({
      userid: ["", Validators.required]
    });

    this.customerService.getAllCustomers().pipe(first()).subscribe((customers) => {
      this.customers = customers;
      console.log(customers);
    });

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.idForm.controls;
  }

  getCustomer() {
    this.loading = true;
    this.customerService
      .getCustomer(this.f.userid.value)
      .pipe(first())
      .subscribe((customer) => {
        this.loading = false;
        this.customer = customer;
        this.isLoaded = true;
        console.log(customer);
      }, (error) => {
        this.error = error;
        this.loading = false;
      });
  }

  createCustomer() {
    this.router.navigate(["create-customer"], { relativeTo: this.route });
  }

  viewAccounts(customerid: string) {
    this.router.navigate([`${customerid}/accounts`], { relativeTo: this.route });
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
