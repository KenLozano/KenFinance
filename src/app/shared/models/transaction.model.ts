export type TransactionType = 'income' | 'expense';

export interface TransactionBase {
  id: string;
  type: TransactionType;

  amount: number;
  date: Date;
  assetId: string;
  note: string;

  createdAt?: Date;
}