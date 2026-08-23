import {
  Injectable,
  Injector,
  inject,
  runInInjectionContext,
} from '@angular/core';

import {
  Firestore,
  Timestamp,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from '@angular/fire/firestore';

import {
  CurrencyCode,
  UserProfile,
} from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(Injector);

  async getProfile(
    uid: string,
  ): Promise<UserProfile | null> {
    const snapshot = await runInInjectionContext(
      this.injector,
      () => {
        const profileRef = doc(
          this.firestore,
          `users/${uid}`,
        );

        return getDoc(profileRef);
      },
    );

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    return {
      name: String(data['name'] ?? ''),
      phone: String(data['phone'] ?? ''),
      birthday: String(data['birthday'] ?? ''),
      city: String(data['city'] ?? ''),
      country: String(data['country'] ?? ''),
      occupation: String(data['occupation'] ?? ''),
      currency: this.normalizeCurrency(
        data['currency'],
      ),
      monthlyTarget: Number(
        data['monthlyTarget'] ?? 0,
      ),
      bio: String(data['bio'] ?? ''),
      recoveryEmail: String(
        data['recoveryEmail'] ?? '',
      ),
      emergencyContact: String(
        data['emergencyContact'] ?? '',
      ),
      updatedAt: this.toDate(
        data['updatedAt'],
      ),
      lastRecoveryRequestAt: this.toDate(
        data['lastRecoveryRequestAt'],
      ),
    };
  }

  async saveProfile(
    uid: string,
    profile: UserProfile,
  ): Promise<void> {
    const {
      updatedAt: _updatedAt,
      lastRecoveryRequestAt:
        _lastRecoveryRequestAt,
      ...profileData
    } = profile;

    await runInInjectionContext(
      this.injector,
      () => {
        const profileRef = doc(
          this.firestore,
          `users/${uid}`,
        );

        return setDoc(
          profileRef,
          {
            ...profileData,
            updatedAt: serverTimestamp(),
          },
          {
            merge: true,
          },
        );
      },
    );
  }

  private normalizeCurrency(
    value: unknown,
  ): CurrencyCode {
    if (
      value === 'USD' ||
      value === 'EUR'
    ) {
      return value;
    }

    return 'PEN';
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