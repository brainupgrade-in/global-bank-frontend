import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {

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
