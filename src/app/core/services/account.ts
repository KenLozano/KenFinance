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
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from '@angular/fire/firestore';

import {
  Account,
  AccountType,
  CurrencyCode,
} from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(Injector);

  async getAccounts(uid: string): Promise<Account[]> {
    const snapshot = await runInInjectionContext(
      this.injector,
      () => {
        const accountsRef = collection(
          this.firestore,
          `users/${uid}/assets`,
        );

        return getDocs(accountsRef);
      },
    );

    return snapshot.docs
      .map((document) => {
        const data = document.data();

        return {
          id: document.id,
          name: String(data['name'] ?? ''),
          type: this.normalizeAccountType(data['type']),
          currency: this.normalizeCurrency(data['currency']),
          active: data['active'] !== false,
          createdAt: this.toDate(data['createdAt']),
          updatedAt: this.toDate(data['updatedAt']),
          archivedAt: this.toDate(data['archivedAt']),
        } satisfies Account;
      })
      .filter((account) => account.active);
  }

  async createAccount(
    uid: string,
    account: Omit<
      Account,
      'id' | 'active' | 'createdAt' | 'updatedAt' | 'archivedAt'
    >,
  ): Promise<string> {
    const documentRef = await runInInjectionContext(
      this.injector,
      () => {
        const accountsRef = collection(
          this.firestore,
          `users/${uid}/assets`,
        );

        return addDoc(accountsRef, {
          name: account.name,
          type: account.type,
          currency: account.currency,
          active: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      },
    );

    return documentRef.id;
  }

  async updateAccount(
    uid: string,
    accountId: string,
    account: Pick<Account, 'name' | 'type' | 'currency'>,
  ): Promise<void> {
    await runInInjectionContext(
      this.injector,
      () => {
        const accountRef = doc(
          this.firestore,
          `users/${uid}/assets/${accountId}`,
        );

        return updateDoc(accountRef, {
          name: account.name,
          type: account.type,
          currency: account.currency,
          updatedAt: serverTimestamp(),
        });
      },
    );
  }

  async archiveAccount(
    uid: string,
    accountId: string,
  ): Promise<void> {
    await runInInjectionContext(
      this.injector,
      () => {
        const accountRef = doc(
          this.firestore,
          `users/${uid}/assets/${accountId}`,
        );

        return updateDoc(accountRef, {
          active: false,
          archivedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      },
    );
  }

  private normalizeCurrency(
    value: unknown,
  ): CurrencyCode {
    if (value === 'USD' || value === 'EUR') {
      return value;
    }

    return 'PEN';
  }

  private normalizeAccountType(
    value: unknown,
  ): AccountType {
    const validTypes: AccountType[] = [
      'bank_account',
      'wallet',
      'cash',
      'credit_card',
      'crypto',
    ];

    if (
      typeof value === 'string' &&
      validTypes.includes(value as AccountType)
    ) {
      return value as AccountType;
    }

    return 'cash';
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