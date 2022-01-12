import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "@app/_services";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
})
export class CustomerComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private authenticationService: AuthenticationService) {}

  ngOnInit() {
    // this.router.navigate(["accounts"], { relativeTo: this.route});
  }

  deposit() {
    this.router.navigate(["deposit"], { relativeTo: this.route });
  }

  transfer() {
    this.router.navigate(["transfer"], { relativeTo: this.route });
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
