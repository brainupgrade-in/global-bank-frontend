import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Account } from "@app/_models/account";
import { Customer } from "@app/_models/customer";
import { Transaction } from "@app/_models/transaction";
import { Observable } from "rxjs";
import { TransactionInput } from "@app/_models/transactioninput";
import { AccountInput } from "@app/_models/accountinput";

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  constructor(private http: HttpClient) {}

  getTransaction(accountid: number) {
    return this.http.get<Transaction[]>(
      `/transaction/getAllTransByAccId/${accountid}`
    );
  }

  withdarw(accountId: number, amount: number) {
    return this.http.post<Account>(
      `/account/withdraw`,
      { accountId, amount }
    );
  }

  deposit(accountId: number, amount: number) {
    return this.http.post<Account>(`/account/deposit`, {
      accountId,
      amount,
    });
  }

  transfer(sourceAccount: AccountInput  , targetAccount: AccountInput, amount: number) {
    var amount1 = 1000;
    var amount2 = 1000;

    return this.http.post<Boolean>(
      `/transaction/transactions`,
      {
        sourceAccount: sourceAccount,
        targetAccount: targetAccount,
        amount: amount,
        reference: "transfer"
      }
    );
  }
}
