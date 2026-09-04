import {
  TestBed,
} from '@angular/core/testing';

import {
  Firestore,
} from '@angular/fire/firestore';

import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import {
  Transaction,
  TransactionService,
} from './transaction';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionService,
        {
          provide: Firestore,
          useValue: {},
        },
      ],
    });

    service =
      TestBed.inject(
        TransactionService,
      );
  });

  describe(
    'calculateAccountBalanceMinorUnits',
    () => {
      it(
        'should calculate income minus expenses',
        () => {
          const transactions: Transaction[] = [
            {
              id: 'income-1',
              type: 'income',
              amount: 100,
              date: new Date(),
              assetId: 'account-1',
              note: '',
              source: 'otros',
              tags: '',
            },
            {
              id: 'expense-1',
              type: 'expense',
              amount: 35.5,
              date: new Date(),
              assetId: 'account-1',
              note: '',
              category: 'green',
              merchant: '',
              method: 'efectivo',
              priority: 'media',
            },
          ];

          expect(
            service
              .calculateAccountBalanceMinorUnits(
                transactions,
                'account-1',
              ),
          ).toBe(6450);
        },
      );

      it(
        'should only use transactions from the selected account',
        () => {
          const transactions: Transaction[] = [
            {
              id: 'income-1',
              type: 'income',
              amount: 100,
              date: new Date(),
              assetId: 'account-1',
              note: '',
              source: 'otros',
              tags: '',
            },
            {
              id: 'income-2',
              type: 'income',
              amount: 500,
              date: new Date(),
              assetId: 'account-2',
              note: '',
              source: 'otros',
              tags: '',
            },
          ];

          expect(
            service
              .calculateAccountBalanceMinorUnits(
                transactions,
                'account-1',
              ),
          ).toBe(10000);
        },
      );

      it(
        'should avoid floating point precision errors',
        () => {
          const transactions: Transaction[] = [
            {
              id: 'income-1',
              type: 'income',
              amount: 0.1,
              date: new Date(),
              assetId: 'account-1',
              note: '',
              source: 'otros',
              tags: '',
            },
            {
              id: 'income-2',
              type: 'income',
              amount: 0.2,
              date: new Date(),
              assetId: 'account-1',
              note: '',
              source: 'otros',
              tags: '',
            },
          ];

          expect(
            service
              .calculateAccountBalanceMinorUnits(
                transactions,
                'account-1',
              ),
          ).toBe(30);
        },
      );

      it(
        'should return zero when there are no transactions',
        () => {
          expect(
            service
              .calculateAccountBalanceMinorUnits(
                [],
                'account-1',
              ),
          ).toBe(0);
        },
      );

      it(
        'should include the initial balance as account income',
        () => {
          const transactions: Transaction[] = [
            {
              id: 'initial-1',
              type: 'income',
              amount: 250,
              date: new Date(),
              assetId: 'account-1',
              note: 'Saldo inicial',
              source: 'otros',
              tags: 'saldo-inicial',
              isInitialBalance: true,
            },
          ];

          expect(
            service
              .calculateAccountBalanceMinorUnits(
                transactions,
                'account-1',
              ),
          ).toBe(25000);
        },
      );
    },
  );

  describe(
    'calculateAccountBalance',
    () => {
      it(
        'should return the account balance in major units',
        () => {
          const transactions: Transaction[] = [
            {
              id: 'income-1',
              type: 'income',
              amount: 100.25,
              date: new Date(),
              assetId: 'account-1',
              note: '',
              source: 'otros',
              tags: '',
            },
            {
              id: 'expense-1',
              type: 'expense',
              amount: 20.1,
              date: new Date(),
              assetId: 'account-1',
              note: '',
              category: 'yellow',
              merchant: '',
              method: 'debito',
              priority: 'media',
            },
          ];

          expect(
            service
              .calculateAccountBalance(
                transactions,
                'account-1',
              ),
          ).toBe(80.15);
        },
      );
    },
  );
});