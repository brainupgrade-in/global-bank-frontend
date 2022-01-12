import { AccountInput } from "./accountinput";

export class TransactionInput {
  sourceAccount: AccountInput;
  targetAccount: AccountInput;
  amount: number;
}
