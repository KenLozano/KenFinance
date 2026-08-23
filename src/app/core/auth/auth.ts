import { Injectable, inject } from '@angular/core';

import {
  Auth as FirebaseAuth,
  GoogleAuthProvider,
  User,
  UserCredential,
  authState,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from '@angular/fire/auth';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(FirebaseAuth);

  readonly user$: Observable<User | null> = authState(this.auth);

  login(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return signInWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
  }

  register(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  sendPasswordReset(email: string): Promise<void> {
    return sendPasswordResetEmail(
      this.auth,
      email,
    );
  }

  updateDisplayName(
    user: User,
    name: string,
  ): Promise<void> {
    return updateProfile(user, {
      displayName: name,
    });
  }

  loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: 'select_account',
    });

    return signInWithPopup(
      this.auth,
      provider,
    );
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }
}