import { TransactionBase } from './transaction.model';

export interface Expense extends TransactionBase {
  type: 'expense';

  category: string;
  merchant: string;
  method: string;
  priority: string;
}