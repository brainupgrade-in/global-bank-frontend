import { Component } from "@angular/core";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from "@angular/router";

import { AuthenticationService } from "./_services";
import { User } from "./_models";

@Component({ selector: "app", templateUrl: "app.component.html" })
export class AppComponent {
  currentUser: User;

  constructor(
    private router: Router,

    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }

//   goHome(route: ActivatedRouteSnapshot) {
//     const currentUser = this.authenticationService.currentUserValue;

//     // logged in so return true
//     if (currentUser) {
//       if (
//         this.route.data.roles &&
//         this.route.data.roles.indexOf(currentUser.role) === -1
//       ) {
//         // role not authorised so redirect to home page
//         this.router.navigate(["customer", `${currentUser.userid}`]);
//       }
//     }
//   }
goHome() {
      this.router.navigate(["../"]);

}
}
