export type CurrencyCode = 'PEN' | 'USD' | 'EUR';

export interface UserProfile {
  name: string;
  phone: string;
  birthday: string;
  city: string;
  country: string;
  occupation: string;
  currency: CurrencyCode;
  monthlyTarget: number;
  bio: string;
  recoveryEmail: string;
  emergencyContact: string;

  updatedAt?: Date;
  lastRecoveryRequestAt?: Date;
}
