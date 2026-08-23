import { TransactionBase } from './transaction.model';

export interface Income extends TransactionBase {
  type: 'income';

  source: string;
  tags: string;

  isInitialBalance?: boolean;

  /**
   * Campo heredado utilizado por algunos movimientos
   * de saldo inicial de KenFinance v1.
   */
  account?: string;
}