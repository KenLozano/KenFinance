import {
  Injectable,
  Injector,
  inject,
  runInInjectionContext,
} from '@angular/core';

import {
  Firestore,
  Timestamp,
  collection,
  getDocs,
} from '@angular/fire/firestore';

import {
  Expense,
  Income,
  TransactionBase,
} from '../../shared/models';

export type Transaction = Income | Expense;

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(Injector);

  async getAllTransactions(
    uid: string,
  ): Promise<Transaction[]> {
    const [incomeSnapshot, expenseSnapshot] =
      await Promise.all([
        runInInjectionContext(
          this.injector,
          () => {
            const incomeRef = collection(
              this.firestore,
              `transactions/${uid}/income`,
            );

            return getDocs(incomeRef);
          },
        ),

        runInInjectionContext(
          this.injector,
          () => {
            const expenseRef = collection(
              this.firestore,
              `transactions/${uid}/expenses`,
            );

            return getDocs(expenseRef);
          },
        ),
      ]);

    const incomes: Income[] =
      incomeSnapshot.docs.map((document) => {
        const data = document.data();

        return {
          id: document.id,
          type: 'income',
          amount: Number(data['amount'] ?? 0),
          date:
            this.toDate(data['date']) ??
            this.toDate(data['createdAt']) ??
            new Date(0),
          assetId: String(data['assetId'] ?? ''),
          note: String(data['note'] ?? ''),
          source: String(data['source'] ?? 'otros'),
          tags: String(data['tags'] ?? ''),
          isInitialBalance:
            data['isInitialBalance'] === true,
          account:
            typeof data['account'] === 'string'
              ? data['account']
              : undefined,
          createdAt: this.toDate(
            data['createdAt'],
          ),
        };
      });

    const expenses: Expense[] =
      expenseSnapshot.docs.map((document) => {
        const data = document.data();

        return {
          id: document.id,
          type: 'expense',
          amount: Number(data['amount'] ?? 0),
          date:
            this.toDate(data['date']) ??
            this.toDate(data['createdAt']) ??
            new Date(0),
          assetId: String(data['assetId'] ?? ''),
          note: String(data['note'] ?? ''),
          category: String(
            data['category'] ?? '',
          ),
          merchant: String(
            data['merchant'] ?? '',
          ),
          method: String(
            data['method'] ?? '',
          ),
          priority: String(
            data['priority'] ?? '',
          ),
          createdAt: this.toDate(
            data['createdAt'],
          ),
        };
      });

    return [...incomes, ...expenses].sort(
      (a, b) =>
        b.date.getTime() - a.date.getTime(),
    );
  }

  calculateAccountBalance(
    transactions: Transaction[],
    assetId: string,
  ): number {
    return transactions
      .filter(
        (transaction) =>
          transaction.assetId === assetId,
      )
      .reduce(
        (total, transaction) =>
          total +
          (
            transaction.type === 'income'
              ? transaction.amount
              : -transaction.amount
          ),
        0,
      );
  }

  private toDate(
    value: unknown,
  ): Date | undefined {
    if (value instanceof Timestamp) {
      return value.toDate();
    }

    return undefined;
  }
}