import {
  Injectable,
  Injector,
  inject,
  runInInjectionContext,
} from '@angular/core';

import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from '@angular/fire/firestore';

import {
  Expense,
  Income,
  TransactionBase,
} from '../../shared/models';

import {
  fromMinorUnits,
  toMinorUnits,
} from '../../shared/utils/money';



export type Transaction = Income | Expense;

export interface CreateIncomeInput {
  amount: number;
  date: Date;
  assetId: string;
  note: string;
  source: string;
  tags: string;
  isInitialBalance?: boolean;
  account?: string;
}

export interface CreateExpenseInput {
  amount: number;
  date: Date;
  assetId: string;
  note: string;
  category: string;
  merchant: string;
  method: string;
  priority: string;
}

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
  

  calculateAccountBalanceMinorUnits(
  transactions: Transaction[],
  assetId: string,
): number {
  return transactions
    .filter(
      (transaction) =>
        transaction.assetId === assetId,
    )
    .reduce(
      (total, transaction) => {
        const amountMinorUnits =
          toMinorUnits(transaction.amount);

        return transaction.type === 'income'
          ? total + amountMinorUnits
          : total - amountMinorUnits;
      },
      0,
    );

    }

    async createIncome(
  uid: string,
  input: CreateIncomeInput,
): Promise<string> {
  this.validateCommonInput(input);

  const documentRef =
    await runInInjectionContext(
      this.injector,
      () => {
        const incomeRef = collection(
          this.firestore,
          `transactions/${uid}/income`,
        );

        return addDoc(
          incomeRef,
          {
            amount:
              this.normalizeAmount(
                input.amount,
              ),

            date:
              Timestamp.fromDate(
                input.date,
              ),

            assetId:
              input.assetId,

            note:
              input.note.trim(),

            source:
              input.source,

            tags:
              input.tags.trim(),

            ...(input.isInitialBalance
              ? {
                  isInitialBalance: true,
                }
              : {}),

            ...(input.account
              ? {
                  account: input.account,
                }
              : {}),

            createdAt:
              serverTimestamp(),
          },
        );
      },
    );

  return documentRef.id;
}

async createExpense(
  uid: string,
  input: CreateExpenseInput,
): Promise<string> {
  this.validateCommonInput(input);

  if (!input.category) {
    throw new Error(
      'Expense category is required.',
    );
  }

  const documentRef =
    await runInInjectionContext(
      this.injector,
      () => {
        const expenseRef = collection(
          this.firestore,
          `transactions/${uid}/expenses`,
        );

        return addDoc(
          expenseRef,
          {
            amount:
              this.normalizeAmount(
                input.amount,
              ),

            date:
              Timestamp.fromDate(
                input.date,
              ),

            assetId:
              input.assetId,

            note:
              input.note.trim(),

            category:
              input.category,

            merchant:
              input.merchant.trim(),

            method:
              input.method,

            priority:
              input.priority,

            createdAt:
              serverTimestamp(),
          },
        );
      },
    );

  return documentRef.id;
}

async updateIncome(
  uid: string,
  transactionId: string,
  input: CreateIncomeInput,
): Promise<void> {
  this.validateCommonInput(input);

  await runInInjectionContext(
    this.injector,
    () => {
      const incomeRef = doc(
        this.firestore,
        `transactions/${uid}/income/${transactionId}`,
      );

      return updateDoc(
        incomeRef,
        {
          amount:
            this.normalizeAmount(
              input.amount,
            ),

          date:
            Timestamp.fromDate(
              input.date,
            ),

          assetId:
            input.assetId,

          note:
            input.note.trim(),

          source:
            input.source,

          tags:
            input.tags.trim(),

          ...(input.isInitialBalance
            ? {
                isInitialBalance: true,
              }
            : {}),

          ...(input.account
            ? {
                account: input.account,
              }
            : {}),
        },
      );
    },
  );
}

async updateExpense(
  uid: string,
  transactionId: string,
  input: CreateExpenseInput,
): Promise<void> {
  this.validateCommonInput(input);

  if (!input.category) {
    throw new Error(
      'Expense category is required.',
    );
  }

  await runInInjectionContext(
    this.injector,
    () => {
      const expenseRef = doc(
        this.firestore,
        `transactions/${uid}/expenses/${transactionId}`,
      );

      return updateDoc(
        expenseRef,
        {
          amount:
            this.normalizeAmount(
              input.amount,
            ),

          date:
            Timestamp.fromDate(
              input.date,
            ),

          assetId:
            input.assetId,

          note:
            input.note.trim(),

          category:
            input.category,

          merchant:
            input.merchant.trim(),

          method:
            input.method,

          priority:
            input.priority,
        },
      );
    },
  );
}

async getTransactionById(
  uid: string,
  type: Transaction['type'],
  transactionId: string,
): Promise<Transaction | null> {
  const collectionName =
    type === 'income'
      ? 'income'
      : 'expenses';

  const snapshot =
    await runInInjectionContext(
      this.injector,
      () => {
        const transactionRef = doc(
          this.firestore,
          `transactions/${uid}/${collectionName}/${transactionId}`,
        );

        return getDoc(
          transactionRef,
        );
      },
    );

  if (!snapshot.exists()) {
    return null;
  }

  const data =
    snapshot.data();

  if (type === 'income') {
    return {
      id: snapshot.id,
      type: 'income',

      amount:
        Number(
          data['amount'] ?? 0,
        ),

      date:
        this.toDate(
          data['date'],
        ) ??
        this.toDate(
          data['createdAt'],
        ) ??
        new Date(0),

      assetId:
        String(
          data['assetId'] ?? '',
        ),

      note:
        String(
          data['note'] ?? '',
        ),

      source:
        String(
          data['source'] ?? 'otros',
        ),

      tags:
        String(
          data['tags'] ?? '',
        ),

      isInitialBalance:
        data['isInitialBalance'] === true,

      account:
        typeof data['account'] === 'string'
          ? data['account']
          : undefined,

      createdAt:
        this.toDate(
          data['createdAt'],
        ),
    };
  }

  return {
    id: snapshot.id,
    type: 'expense',

    amount:
      Number(
        data['amount'] ?? 0,
      ),

    date:
      this.toDate(
        data['date'],
      ) ??
      this.toDate(
        data['createdAt'],
      ) ??
      new Date(0),

    assetId:
      String(
        data['assetId'] ?? '',
      ),

    note:
      String(
        data['note'] ?? '',
      ),

    category:
      String(
        data['category'] ?? '',
      ),

    merchant:
      String(
        data['merchant'] ?? '',
      ),

    method:
      String(
        data['method'] ?? '',
      ),

    priority:
      String(
        data['priority'] ?? '',
      ),

    createdAt:
      this.toDate(
        data['createdAt'],
      ),
  };
}

async deleteTransaction(
  uid: string,
  type: Transaction['type'],
  transactionId: string,
): Promise<void> {
  const collectionName =
    type === 'income'
      ? 'income'
      : 'expenses';

  await runInInjectionContext(
    this.injector,
    () => {
      const transactionRef = doc(
        this.firestore,
        `transactions/${uid}/${collectionName}/${transactionId}`,
      );

      return deleteDoc(
        transactionRef,
      );
    },
  );
}

calculateAccountBalance(
  transactions: Transaction[],
  assetId: string,
): number {
  return fromMinorUnits(
    this.calculateAccountBalanceMinorUnits(
      transactions,
      assetId,
    ),
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
  private validateCommonInput(
  input: {
    amount: number;
    date: Date;
    assetId: string;
  },
): void {
  if (!input.assetId) {
    throw new Error(
      'Transaction account is required.',
    );
  }

  if (
    !Number.isFinite(
      input.amount,
    ) ||
    input.amount <= 0 ||
    input.amount > 999_999_999
  ) {
    throw new Error(
      'Invalid transaction amount.',
    );
  }

  if (
    !(input.date instanceof Date) ||
    Number.isNaN(
      input.date.getTime(),
    )
  ) {
    throw new Error(
      'Invalid transaction date.',
    );
  }

  const todayEnd =
    new Date();

  todayEnd.setHours(
    23,
    59,
    59,
    999,
  );

  if (
    input.date >
    todayEnd
  ) {
    throw new Error(
      'Future transactions are not allowed.',
    );
  }
}

private normalizeAmount(
  amount: number,
): number {
  return fromMinorUnits(
    toMinorUnits(amount),
  );
}
}