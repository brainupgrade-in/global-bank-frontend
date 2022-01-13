import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Account } from "@app/_models/account";
import { AccountCreationStatus } from "@app/_models/accountCreationStatus";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  constructor(private http: HttpClient) {}

  getCustAccounts(customerid: string) {
    return this.http.get<Account[]>(
      `/account/getAccounts/${customerid}`
    );
  }
  getAccount(accountid: number) {
    return this.http.get<Account>(
      `/account/getAccount/${accountid}`
    );
  }

  createAccount(
    customerid: string,
    accountId: number,
    customerId: string,
    currentBalance: number,
    accountType: string,
    ownerName: string
  ) {
    return this.http.post<AccountCreationStatus>(
      `/account/createAccount/${customerid}`,
      { accountId, customerId, currentBalance, accountType, ownerName }
    );
  }
}
