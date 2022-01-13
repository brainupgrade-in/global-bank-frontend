import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Account } from "@app/_models/account";
import { Customer } from "@app/_models/customer";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RulesService {
  constructor(private http: HttpClient) {}

  evaluateMinBal() {

  }
  getServiceCharges(){
      return this.http.get<Account[]>(`/account/getAccount/10054546`);
  }



}
