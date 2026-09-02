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
  private validateProfile(
  profile: UserProfile,
): void {
  if (
    !profile.name.trim() ||
    profile.name.trim().length > 60
  ) {
    throw new Error(
      'Invalid profile name.',
    );
  }

  if (
    profile.phone.trim().length > 20
  ) {
    throw new Error(
      'Invalid phone length.',
    );
  }

  if (
    profile.birthday.length > 20
  ) {
    throw new Error(
      'Invalid birthday length.',
    );
  }

  if (
    profile.city.trim().length > 50
  ) {
    throw new Error(
      'Invalid city length.',
    );
  }

  if (
    profile.country.trim().length > 50
  ) {
    throw new Error(
      'Invalid country length.',
    );
  }

  if (
    profile.occupation.trim().length > 60
  ) {
    throw new Error(
      'Invalid occupation length.',
    );
  }

  if (
    profile.bio.trim().length > 240
  ) {
    throw new Error(
      'Invalid biography length.',
    );
  }

  if (
    profile.recoveryEmail.trim().length > 120
  ) {
    throw new Error(
      'Invalid recovery email length.',
    );
  }

  if (
    profile.emergencyContact.trim().length > 20
  ) {
    throw new Error(
      'Invalid emergency contact length.',
    );
  }

  if (
    ![
      'PEN',
      'USD',
      'EUR',
    ].includes(profile.currency)
  ) {
    throw new Error(
      'Invalid profile currency.',
    );
  }

  if (
    !Number.isFinite(
      profile.monthlyTarget,
    ) ||
    profile.monthlyTarget < 0 ||
    profile.monthlyTarget >
      999_999_999
  ) {
    throw new Error(
      'Invalid monthly target.',
    );
  }
  this.validateProfile(profile);//esto va acá?

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