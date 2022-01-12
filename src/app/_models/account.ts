import { Transaction } from "./transaction";
export class Account {

accountId: number;
customerId:string;
currentBalance:number;
accountType:string;
ownerName:string;
transactions?: [Transaction];
    
}