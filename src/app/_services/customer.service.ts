import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Customer } from "@app/_models/customer";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getCustomer(userid: string) {
    return this.http.get<Customer>(
      `/customer/getCustomerDetails/${userid}`
    );
  }

  createCustomer(
    userid: string,
    username: string,
    password: string,
    dateOfBirth: string,
    pan: string,
    address: string
  ) {
    return this.http.post<Customer>(
      `/customer/createCustomer`,
      { userid, username, password, dateOfBirth, pan, address }
    );
  }

  getAllCustomers() {
    return this.http.get<Customer[]> (
      `/customer/getCustomers`
    );
  }
}
