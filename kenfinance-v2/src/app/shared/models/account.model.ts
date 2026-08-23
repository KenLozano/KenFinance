import { CurrencyCode } from './user-profile.model';

export type AccountType =
  | 'bank_account'
  | 'wallet'
  | 'cash'
  | 'credit_card'
  | 'crypto';

export interface Account {
  id: string;

  name: string;
  type: AccountType;
  currency: CurrencyCode;

  active: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  archivedAt?: Date;
}